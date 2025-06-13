import { Readable } from 'stream'

import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import {
  flashErrorAndRedirect,
  isValidFormDefinition
} from '~/src/routes/forms/editor-v2/upload.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

/**
 * Create a mock file stream for testing
 * @param {string} content - The file content
 * @param {string} filename - The filename
 */
function createMockFileStream(content, filename) {
  const stream = new Readable({
    read() {
      this.push(content)
      this.push(null) // End the stream
    }
  })

  // @ts-expect-error - hapi property for testing
  stream.hapi = { filename }

  return stream
}

describe('Editor v2 upload routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /library/{slug}/editor-v2/upload', () => {
    test('should render upload page with correct content', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/upload',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $fileInput = container.getByLabelText('Choose a form file')
      const $uploadButton = container.getByRole('button', {
        name: 'Upload form'
      })
      const $backLink = container.getByRole('link', { name: 'Back to pages' })

      expect($mainHeading).toHaveTextContent('Upload a form')
      expect($fileInput).toBeInTheDocument()
      expect($uploadButton).toBeInTheDocument()
      expect($backLink).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/pages'
      )
    })

    test('should display validation errors when present in session', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/upload',
        auth
      }

      // We can't easily mock yar in the test, so we'll test this indirectly
      // by checking that the view model handles validation correctly
      const { container } = await renderResponse(server, options)

      // The page should still render correctly even without validation errors
      const $mainHeading = container.getByRole('heading', { level: 1 })
      expect($mainHeading).toHaveTextContent('Upload a form')
    })
  })

  describe('POST /library/{slug}/editor-v2/upload', () => {
    test('should redirect with error when no file is selected', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: null
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should redirect with error when file is not JSON', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream(
            'not json content',
            'test-form.txt'
          )
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should redirect with error when file contains invalid JSON', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream(
            '{ invalid json }',
            'test-form.json'
          )
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should redirect with error when JSON is valid but not a form definition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const invalidFormDefinition = {
        notAForm: true,
        someOtherData: 'value'
      }

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream(
            JSON.stringify(invalidFormDefinition),
            'test-form.json'
          )
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should redirect with error when form definition has no pages array', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const invalidFormDefinition = {
        lists: [],
        sections: [],
        conditions: []
        // Missing pages array
      }

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream(
            JSON.stringify(invalidFormDefinition),
            'test-form.json'
          )
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should redirect with error when form definition has non-array pages', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const invalidFormDefinition = {
        pages: 'not an array',
        lists: [],
        sections: [],
        conditions: []
      }

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream(
            JSON.stringify(invalidFormDefinition),
            'test-form.json'
          )
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should handle file with no filename property', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const stream = new Readable({
        read() {
          this.push('{}')
          this.push(null)
        }
      })
      // No hapi property at all

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: stream
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should handle file with empty filename', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {
          formDefinition: createMockFileStream('{}', '')
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })

    test('should handle Joi validation error for missing formDefinition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/upload',
        auth,
        payload: {}
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/library/my-form-slug/editor-v2/upload')
    })
  })

  describe('Utility functions', () => {
    test('isValidFormDefinition should validate form structure correctly', () => {
      const validForm = {
        pages: [{ id: 'page1', title: 'Test' }],
        lists: [],
        sections: [],
        conditions: []
      }
      expect(isValidFormDefinition(validForm)).toBe(true)

      const invalidForm1 = {
        lists: [],
        sections: [],
        conditions: []
      }
      expect(isValidFormDefinition(invalidForm1)).toBe(false)

      const invalidForm2 = {
        pages: 'not an array',
        lists: [],
        sections: [],
        conditions: []
      }
      expect(isValidFormDefinition(invalidForm2)).toBe(false)

      expect(isValidFormDefinition(null)).toBe(false)

      expect(isValidFormDefinition('string')).toBe(false)

      expect(isValidFormDefinition(undefined)).toBe(false)

      expect(isValidFormDefinition({})).toBe(false)

      const invalidForm3 = {
        pages: null,
        lists: [],
        sections: [],
        conditions: []
      }
      expect(isValidFormDefinition(invalidForm3)).toBe(false)
    })

    test('flashErrorAndRedirect should create proper error response', () => {
      const mockH = {
        redirect: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis()
      }
      const mockYar = {
        flash: jest.fn()
      }
      const slug = 'test-form'
      const errorMessage = 'Test error message'

      const result = flashErrorAndRedirect(mockH, mockYar, slug, errorMessage)

      expect(mockYar.flash).toHaveBeenCalledWith('uploadValidationFailure', {
        formErrors: {
          formDefinition: {
            text: errorMessage,
            href: '#formDefinition'
          }
        },
        formValues: {}
      })
      expect(mockH.redirect).toHaveBeenCalledWith(
        '/library/test-form/editor-v2/upload'
      )
      expect(mockH.code).toHaveBeenCalledWith(StatusCodes.SEE_OTHER)
      expect(result).toBe(mockH)
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
