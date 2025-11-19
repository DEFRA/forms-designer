import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/list.js')
jest.mock('~/src/routes/forms/editor-v2/question-details-helper.js')

describe('Editor v2 question details error messages', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Error messages of all fields', () => {
    // prettier-ignore
    it.each([
      /**
       * Date parts field - maxFuture
       */
      [ ComponentType.DatePartsField, { maxFuture: 'a' }, 'Maximum days in the future must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxFuture: '-1' }, 'Maximum days in the future must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxFuture: 'a123' }, 'Maximum days in the future must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxFuture: '-100' }, 'Maximum days in the future must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxFuture: '1.1' }, 'Maximum days in the future must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxFuture: '10.25' }, 'Maximum days in the future must be a positive whole number' ],
      /**
       * Date parts field - maxPast
       */
      [ ComponentType.DatePartsField, { maxPast: 'a' }, 'Maximum days in the past must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxPast: '-1' }, 'Maximum days in the past must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxPast: 'a123' }, 'Maximum days in the past must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxPast: '-100' }, 'Maximum days in the past must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxPast: '1.1' }, 'Maximum days in the past must be a positive whole number' ],
      [ ComponentType.DatePartsField, { maxPast: '10.25' }, 'Maximum days in the past must be a positive whole number' ],

      /**
       * Number field - min value
       */
      [ ComponentType.NumberField, { min: 'a' }, 'Lowest number must be a whole number' ],
      [ ComponentType.NumberField, { min: 'a123' }, 'Lowest number must be a whole number' ],
      [ ComponentType.NumberField, { min: '1.1' }, 'Lowest number must be a whole number' ],
      [ ComponentType.NumberField, { min: '10.25' }, 'Lowest number must be a whole number' ],
      /**
       * Number field - max value
       */
      [ ComponentType.NumberField, { max: 'a' }, 'Highest number must be a whole number' ],
      [ ComponentType.NumberField, { max: 'a123' }, 'Highest number must be a whole number' ],
      [ ComponentType.NumberField, { max: '1.1' }, 'Highest number must be a whole number' ],
      [ ComponentType.NumberField, { max: '10.25' }, 'Highest number must be a whole number' ],
      /**
       * Number field - min/max range
       */
      [ ComponentType.NumberField, { min: '5', max: '3' }, 'Lowest number cannot be more than the highest number' ],
      /**
       * Number field - precision
       */
      [ ComponentType.NumberField, { precision: 'a' }, 'Enter a whole number between 0 and 5' ],
      [ ComponentType.NumberField, { precision: '-1' }, 'Enter a whole number between 0 and 5' ],
      [ ComponentType.NumberField, { precision: 'a123' }, 'Enter a whole number between 0 and 5' ],
      [ ComponentType.NumberField, { precision: '6' }, 'Enter a whole number between 0 and 5' ],
      [ ComponentType.NumberField, { precision: '1.1' }, 'Enter a whole number between 0 and 5' ],
      [ ComponentType.NumberField, { precision: '10.25' }, 'Enter a whole number between 0 and 5' ],

      /**
       * Text field - min length
       */
      [ ComponentType.TextField, { minLength: 'a' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.TextField, { minLength: '-1' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.TextField, { minLength: '0' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.TextField, { minLength: 'a123' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.TextField, { minLength: '1.1' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.TextField, { minLength: '10.25' }, 'Minimum length must be a positive whole number' ],
      /**
       * Text field - max length
       */
      [ ComponentType.TextField, { maxLength: 'a' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.TextField, { maxLength: 'a123' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.TextField, { maxLength: '-1' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.TextField, { maxLength: '1.1' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.TextField, { maxLength: '10.25' }, 'Maximum length must be a positive whole number' ],
      /**
       * Text field - min/max range
       */
      [ ComponentType.TextField, { minLength: '5', maxLength: '3' }, 'Minimum length must be less than or equal to maximum length' ],

      /**
       * Multiline text field - min length
       */
      [ ComponentType.MultilineTextField, { minLength: 'a' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { minLength: '-1' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { minLength: '0' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { minLength: 'a123' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { minLength: '1.1' }, 'Minimum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { minLength: '10.25' }, 'Minimum length must be a positive whole number' ],
      /**
       * Multiline text field - max length
       */
      [ ComponentType.MultilineTextField, { maxLength: 'a' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { maxLength: 'a123' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { maxLength: '-1' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { maxLength: '1.1' }, 'Maximum length must be a positive whole number' ],
      [ ComponentType.MultilineTextField, { maxLength: '10.25' }, 'Maximum length must be a positive whole number' ],
      /**
       * Multiline text field - min/max range
       */
      [ ComponentType.MultilineTextField, { minLength: '5', maxLength: '3' }, 'Minimum length must be less than or equal to maximum length' ],
      /**
       * Multiline text field - rows
       */
      [ ComponentType.MultilineTextField, { rows: 'a' }, 'Enter a positive whole number' ],
      [ ComponentType.MultilineTextField, { rows: 'a123' }, 'Enter a positive whole number' ],
      [ ComponentType.MultilineTextField, { rows: '-1' }, 'Enter a positive whole number' ],
      [ ComponentType.MultilineTextField, { rows: '0' }, 'Enter a positive whole number' ],
      [ ComponentType.MultilineTextField, { rows: '1.1' }, 'Enter a positive whole number' ],
      [ ComponentType.MultilineTextField, { rows: '10.25' }, 'Enter a positive whole number' ],

      /**
       * File upload field - min file count
       */
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: 'a' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '-1' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '0' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '26' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: 'a123' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '1.1' }, 'Minimum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '10.25' }, 'Minimum file count must be a whole number between 1 and 25' ],
      /**
       * File upload field - max file count
       */
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: 'a' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '-1' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '0' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '26' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: 'a123' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '1.1' }, 'Maximum file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '10.25' }, 'Maximum file count must be a whole number between 1 and 25' ],
      /**
       * File upload field - exact file count
       */
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: 'a' }, 'Exact file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: '-1' }, 'Exact file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: '26' }, 'Exact file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: 'a123' }, 'Exact file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: '1.1' }, 'Exact file count must be a whole number between 1 and 25' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', exactFiles: '10.25' }, 'Exact file count must be a whole number between 1 and 25' ],
      /**
       * File upload field - min/max range
       */
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '2', maxFiles: '1' }, 'The minimum number of files you accept cannot be greater than the maximum' ],
      /**
       * File upload field - min/max with exact
       */
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', minFiles: '2', exactFiles: '1' }, 'Enter an exact amount or choose the minimum and maximum range allowed' ],
      [ ComponentType.FileUploadField, { fileTypes: 'documents', documentTypes: 'pdf', maxFiles: '2', exactFiles: '1' }, 'Enter an exact amount or choose the minimum and maximum range allowed' ]
    ])(
      '%s: should error when value is %s',
      async (componentType, fieldPayload, expectedErrorMessage) => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
          auth,
          payload: {
            name: 'abc123',
            question: 'My field title',
            shortDescription: 'My short desc',
            questionType: componentType,
            ...fieldPayload
          }
        }

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe(
          '/library/my-form-slug/editor-v2/page/1/question/1/details#'
        )
        expect(addErrorsToSession).toHaveBeenCalledWith(
          expect.anything(),
          'questionDetailsValidationFailure',
          new Joi.ValidationError(expectedErrorMessage, [], undefined)
        )
      }
    )
  })

  describe('Number field', () => {
    test('POST - should error if minLength greater than maxLength', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
        auth,
        payload: {
          name: '12345',
          question: 'Question text',
          shortDescription: 'Short desc',
          questionType: ComponentType.NumberField,
          minLength: '5',
          maxLength: '3'
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/1/question/1/details#'
      )
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'questionDetailsValidationFailure',
        new Joi.ValidationError(
          'Minimum length must be less than or equal to maximum length',
          [],
          undefined
        )
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
