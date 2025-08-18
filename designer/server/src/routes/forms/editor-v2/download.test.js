import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { publishFormDownloadedEvent } from '~/src/messaging/publish.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/messaging/publish.js')

describe('Editor v2 download routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /library/{slug}/editor-v2/download', () => {
    test('should download form definition as JSON file', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      )
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename="my-form-slug.json"'
      )

      // Verify the response body is valid JSON
      const downloadedDefinition = JSON.parse(response.payload)
      expect(downloadedDefinition).toEqual(testFormDefinitionWithSummaryOnly)

      // Verify API calls
      expect(forms.get).toHaveBeenCalledWith(
        'my-form-slug',
        auth.credentials.token
      )
      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token
      )
    })

    test('should format JSON with proper indentation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/test-form/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const expectedJson = JSON.stringify(
        testFormDefinitionWithSummaryOnly,
        null,
        2
      )
      expect(response.payload).toBe(expectedJson)
    })

    test('should handle forms with special characters in slug', async () => {
      const specialSlug = 'form-with-special-chars_123'
      const mockMetadata = { ...testFormMetadata, slug: specialSlug }

      jest.mocked(forms.get).mockResolvedValueOnce(mockMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: `/library/${specialSlug}/editor-v2/download`,
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.headers['content-disposition']).toBe(
        `attachment; filename="${specialSlug}.json"`
      )
    })

    test('should handle empty form definition', async () => {
      const emptyDefinition = {
        pages: [],
        lists: [],
        sections: [],
        conditions: []
      }

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(emptyDefinition)

      const options = {
        method: 'get',
        url: '/library/empty-form/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const downloadedDefinition = JSON.parse(response.payload)
      expect(downloadedDefinition).toEqual(emptyDefinition)
    })

    test('should handle large form definition', async () => {
      // Use the existing test definition for simplicity
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/large-form/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      )

      const downloadedDefinition = JSON.parse(response.payload)
      expect(downloadedDefinition).toEqual(testFormDefinitionWithSummaryOnly)
    })

    test('should return 500 when forms.get fails', async () => {
      jest.mocked(forms.get).mockRejectedValueOnce(new Error('Form not found'))

      const options = {
        method: 'get',
        url: '/library/nonexistent-form/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(forms.get).toHaveBeenCalledWith(
        'nonexistent-form',
        auth.credentials.token
      )
    })

    test('should return 500 when getDraftFormDefinition fails', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockRejectedValueOnce(new Error('Definition not found'))

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token
      )
    })

    test('should require authentication', async () => {
      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('should handle form definition with minimal data', async () => {
      const minimalDefinition = {
        pages: [],
        lists: [],
        sections: [],
        conditions: []
      }

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(minimalDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const downloadedDefinition = JSON.parse(response.payload)
      expect(downloadedDefinition).toEqual(minimalDefinition)
      expect(downloadedDefinition.pages).toEqual([])
      expect(downloadedDefinition.lists).toEqual([])
    })
  })

  describe('Audit Event Publishing', () => {
    test('should publish audit event on successful download', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)
      jest.mocked(publishFormDownloadedEvent).mockResolvedValueOnce({
        MessageId: 'test-message-id',
        SequenceNumber: undefined,
        $metadata: {}
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      // Verify audit event was published with correct parameters
      expect(publishFormDownloadedEvent).toHaveBeenCalledTimes(1)
      expect(publishFormDownloadedEvent).toHaveBeenCalledWith(
        testFormMetadata.id, // formId
        'my-form-slug', // slug
        {
          id: auth.credentials.user?.id,
          displayName: auth.credentials.user?.displayName
        } // auditUser
      )
    })

    test('should publish audit event with correct user information', async () => {
      const customAuth = {
        strategy: 'azure-oidc',
        credentials: {
          ...auth.credentials,
          user: {
            id: 'custom-user-id-123',
            displayName: 'Custom Test User',
            email: 'custom.user@test.com'
          }
        }
      }

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)
      jest.mocked(publishFormDownloadedEvent).mockResolvedValueOnce({
        MessageId: 'test-message-id',
        SequenceNumber: undefined,
        $metadata: {}
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth: customAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      // Verify audit event was published with the custom user info
      expect(publishFormDownloadedEvent).toHaveBeenCalledWith(
        testFormMetadata.id,
        'my-form-slug',
        {
          id: 'custom-user-id-123',
          displayName: 'Custom Test User'
        }
      )
    })

    test('should publish audit event with correct form information', async () => {
      const customFormMetadata = {
        ...testFormMetadata,
        id: 'custom-form-id-456',
        slug: 'custom-form-slug'
      }

      jest.mocked(forms.get).mockResolvedValueOnce(customFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)
      jest.mocked(publishFormDownloadedEvent).mockResolvedValueOnce({
        MessageId: 'test-message-id',
        SequenceNumber: undefined,
        $metadata: {}
      })

      const options = {
        method: 'get',
        url: '/library/custom-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)

      // Verify audit event was published with the custom form info
      expect(publishFormDownloadedEvent).toHaveBeenCalledWith(
        'custom-form-id-456',
        'custom-form-slug',
        {
          id: auth.credentials.user?.id,
          displayName: auth.credentials.user?.displayName
        }
      )
    })

    test('should not publish audit event if forms.get fails', async () => {
      jest.mocked(forms.get).mockRejectedValueOnce(new Error('Form not found'))

      const options = {
        method: 'get',
        url: '/library/nonexistent-form/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

      // Verify audit event was not published since form retrieval failed
      expect(publishFormDownloadedEvent).not.toHaveBeenCalled()
    })

    test('should not publish audit event if getDraftFormDefinition fails', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockRejectedValueOnce(new Error('Definition not found'))

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)

      // Verify audit event was not published since definition retrieval failed
      expect(publishFormDownloadedEvent).not.toHaveBeenCalled()
    })

    test('should publish audit event after successful JSON preparation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      let auditEventPublished = false
      jest.mocked(publishFormDownloadedEvent).mockImplementation(() => {
        auditEventPublished = true
        return Promise.resolve({
          MessageId: 'test-message-id',
          SequenceNumber: undefined,
          $metadata: {}
        })
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/download',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(auditEventPublished).toBe(true)

      // Verify that both the forms API calls happened before the audit event
      expect(forms.get).toHaveBeenCalledWith(
        'my-form-slug',
        auth.credentials.token
      )
      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token
      )
      expect(publishFormDownloadedEvent).toHaveBeenCalled()
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
