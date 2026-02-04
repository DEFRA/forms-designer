import Boom from '@hapi/boom'
import archiver from 'archiver'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSinglePage } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getUser } from '~/src/lib/manage.js'
import {
  publishFormsBackupRequestedEvent,
  publishPlatformCsatExcelRequestedEvent
} from '~/src/messaging/publish.js'
import { sendFeedbackSubmissionsFile } from '~/src/services/formSubmissionService.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')
jest.mock('~/src/messaging/publish.js')
jest.mock('~/src/services/formSubmissionService.js')
jest.mock('~/src/lib/manage.js')
jest.mock('archiver', () => {
  /** @type {Pick<ReturnType<typeof Archiver>,'append' | 'pipe' | 'on' | 'finalize'>} */
  let mockArchiverInstance
  /** @type {Set<PassThrough>} */
  let mockStreams
  /**
   * @type {jest.MockedFunction<ReturnType<typeof Archiver>['append']>}
   */
  let mockAppend
  /**
   * @type {jest.MockedFunction<ReturnType<Archiver>['pipe']>}
   */
  let mockPipe
  /** @type {jest.MockedFunction<ReturnType<Archiver>['on']>} */
  let mockOn
  /** @type {jest.MockedFunction<ReturnType<Archiver>['finalize']>} */
  let mockFinalize

  const setup = () => {
    mockStreams = new Set()

    const instance = {}

    mockAppend = jest.fn().mockReturnValue(instance)

    mockPipe = jest.fn().mockImplementation((stream) => {
      mockStreams.add(stream)
      return stream
    })
    mockOn = jest.fn().mockReturnValue(instance)
    mockFinalize = jest.fn().mockImplementation(() => {
      for (const stream of mockStreams) {
        stream.end()
        stream.emit('close')
      }
    })

    mockArchiverInstance = {
      append: mockAppend,
      pipe: mockPipe,
      on: mockOn,
      finalize: mockFinalize
    }

    Object.assign(
      instance,
      jest.requireActual('archiver').default,
      mockArchiverInstance
    )
  }

  setup()

  /**
   * @type {jest.Mock }
   */
  const factory = jest.fn(() => mockArchiverInstance)
  return {
    __esModule: true,
    default: factory
  }
})

function getManifestJsonFromArchive() {
  const archiverMock = jest.mocked(archiver)
  const instance = archiverMock.mock.results[0]?.value
  const appendCalls = instance?.append?.mock.calls ?? []
  const manifestCall = appendCalls.find(
    (/** @type {{name:string}[]} */ call) => call[1]?.name === 'manifest.json'
  )
  if (!manifestCall) {
    return undefined
  }
  return JSON.parse(manifestCall[0])
}

describe('System admin routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    test('should render table with options', async () => {
      const options = {
        method: 'get',
        url: '/admin/index',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[4]).toHaveTextContent('My account')
      expect($links[5]).toHaveTextContent('Manage users')
      expect($links[6]).toHaveTextContent('Admin tools')
      expect($links[7]).toHaveTextContent('Support')

      const $feedbackLinks = container.getAllByRole('button')
      expect($feedbackLinks[2]).toHaveTextContent('Send feedback data')
    })
  })

  describe('POST', () => {
    describe('action=feedback', () => {
      test('should error if invalid payload key', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { invalid: 'true' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
      })

      test('should error if invalid payload value', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'invalid' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
      })

      test('should handle boom error if boom received from API call', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce({
          ...testFormMetadata,
          notificationEmail: 'something@text.com'
        })
        jest.mocked(sendFeedbackSubmissionsFile).mockImplementationOnce(() => {
          throw Boom.notFound()
        })

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'feedback' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.NOT_FOUND)
      })

      test('should handle valid payload', async () => {
        const mockEmail = 'target@test.gov.uk'

        jest.mocked(forms.get).mockResolvedValueOnce({
          ...testFormMetadata,
          notificationEmail: 'test@defratest.gov.uk'
        })
        jest
          .mocked(getUser)
          // @ts-expect-error - mocked only partial object
          .mockResolvedValueOnce({ email: mockEmail })

        jest.mocked(sendFeedbackSubmissionsFile).mockResolvedValueOnce({
          message: 'Generate file success'
        })

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'feedback' }
        }

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe('/admin/index')
        expect(sendFeedbackSubmissionsFile).toHaveBeenCalledTimes(1)
        expect(publishPlatformCsatExcelRequestedEvent).toHaveBeenCalledWith(
          {
            formId: 'platform',
            formName: 'all',
            notificationEmail: mockEmail.toLowerCase()
          },
          expect.objectContaining({
            id: expect.any(String),
            displayName: expect.any(String)
          })
        )
      })
    })

    describe('action=download', () => {
      test('should error if no forms available', async () => {
        // Mock that returns empty array
        jest.mocked(forms.listAll).mockResolvedValueOnce([])

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
        expect(response.result).toMatchObject({
          message: 'No forms available to download'
        })
      })

      test('should handle listAll errors', async () => {
        // Mock that throws
        jest.mocked(forms.listAll).mockRejectedValueOnce(new Error('API error'))

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(response.result).toMatchObject({
          message: 'Failed to download forms',
          error: 'API error'
        })
      })

      test('should download all forms successfully with both live and draft definitions', async () => {
        const mockForms = [
          testFormMetadata,
          { ...testFormMetadata, id: 'form-2', slug: 'form-2' }
        ]

        jest.mocked(forms.listAll).mockResolvedValueOnce(mockForms)

        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)
        jest
          .mocked(forms.getLiveFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(StatusCodes.OK)

        // Verify headers
        expect(response.headers['content-type']).toBe('application/zip')
        expect(response.headers['content-disposition']).toBe(
          'attachment; filename="forms.zip"'
        )

        // Verify audit event published
        expect(publishFormsBackupRequestedEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            displayName: expect.any(String)
          }),
          2,
          expect.any(Number)
        )

        const manifest = getManifestJsonFromArchive()
        expect(manifest).toMatchObject({
          forms: {
            count: 2,
            entities: expect.arrayContaining([
              expect.objectContaining({
                id: testFormMetadata.id,
                title: testFormMetadata.title,
                slug: testFormMetadata.slug
              }),
              expect.objectContaining({
                id: 'form-2',
                title: testFormMetadata.title,
                slug: 'form-2'
              })
            ])
          }
        })

        // Verify form definitions were requested
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(2)
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(2)
      })

      test('should handle forms with only live definition (no draft)', async () => {
        const formWithoutDraft = {
          ...testFormMetadata,
          draft: undefined
        }

        jest.mocked(forms.listAll).mockResolvedValueOnce([formWithoutDraft])

        const notFoundError = Object.assign(new Error('Not found'), {
          data: { statusCode: StatusCodes.NOT_FOUND }
        })

        jest
          .mocked(forms.getLiveFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)

        jest
          .mocked(forms.getDraftFormDefinition)
          .mockRejectedValueOnce(notFoundError)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.OK)

        // Verify live definition was requested
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(1)
        // Draft definition is always requested and 404 is ignored
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(1)

        // Verify audit event published
        expect(publishFormsBackupRequestedEvent).toHaveBeenCalledWith(
          expect.any(Object),
          1,
          expect.any(Number)
        )
      })

      test('should throw error if one of the api calls fails (non 404 error)', async () => {
        const form1 = testFormMetadata
        const form2 = {
          ...testFormMetadata,
          id: 'form-2',
          slug: 'form-2',
          draft: undefined
        }

        jest.mocked(forms.listAll).mockResolvedValueOnce([form1, form2])

        // Form 1 definition fetch fails, form 2 will succeed
        jest
          .mocked(forms.getLiveFormDefinition)
          .mockRejectedValueOnce(new Error('API error'))
          .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(response.result).toMatchObject({
          message: 'Failed to download forms',
          error: 'API error'
        })

        // Verify definitions were requested
        expect(publishFormsBackupRequestedEvent).not.toHaveBeenCalled()
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(2)
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(2)
      })

      test('should ignore 404 when fetching live definition', async () => {
        const form1 = testFormMetadata

        jest.mocked(forms.listAll).mockResolvedValueOnce([form1])

        const notFoundError = Object.assign(new Error('Not found'), {
          data: { statusCode: StatusCodes.NOT_FOUND }
        })

        jest
          .mocked(forms.getLiveFormDefinition)
          .mockRejectedValueOnce(notFoundError)

        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(publishFormsBackupRequestedEvent).toHaveBeenCalledWith(
          expect.any(Object),
          1,
          expect.any(Number)
        )
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(1)
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(1)
      })

      test('should ignore 404 when fetching draft definition', async () => {
        const form1 = testFormMetadata

        jest.mocked(forms.listAll).mockResolvedValueOnce([form1])

        const notFoundError = Object.assign(new Error('Not found'), {
          data: { statusCode: StatusCodes.NOT_FOUND }
        })

        jest
          .mocked(forms.getLiveFormDefinition)
          .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

        jest
          .mocked(forms.getDraftFormDefinition)
          .mockRejectedValueOnce(notFoundError)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(publishFormsBackupRequestedEvent).toHaveBeenCalledWith(
          expect.any(Object),
          1,
          expect.any(Number)
        )
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(1)
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(1)
      })

      test('should process multiple forms in parallel', async () => {
        // Create 12 forms to test parallel processing
        const mockForms = Array.from({ length: 12 }, (_, i) => ({
          ...testFormMetadata,
          id: `form-${i}`,
          slug: `form-${i}`
        }))

        jest.mocked(forms.listAll).mockResolvedValueOnce(mockForms)

        jest
          .mocked(forms.getLiveFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValue(testFormDefinitionWithSinglePage)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'download' }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(StatusCodes.OK)

        // Verify all forms were processed
        expect(publishFormsBackupRequestedEvent).toHaveBeenCalledWith(
          expect.any(Object),
          12,
          expect.any(Number)
        )

        const manifest = getManifestJsonFromArchive()
        expect(manifest).toMatchObject({
          forms: {
            count: 12
          }
        })
        expect(manifest.forms.entities).toHaveLength(12)

        // Verify all form definitions were fetched
        expect(forms.getLiveFormDefinition).toHaveBeenCalledTimes(12)
        expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(12)
      })
    })
  })
})
/**
 * @import { Server } from '@hapi/hapi'
 * @import Archiver from 'archiver'
 * @import {PassThrough} from 'node:stream'
 */
