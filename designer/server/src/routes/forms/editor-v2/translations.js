import { Scopes, getErrorMessage } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import xlsx from 'xlsx'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getTranslationsAsExcel,
  validateWorkbook
} from '~/src/models/forms/editor-v2/translations-excel.js'
import {
  deleteConfirmationPageViewModel,
  translationsViewModel
} from '~/src/models/forms/editor-v2/translations.js'
import { uploadViewModel } from '~/src/models/forms/editor-v2/upload.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_PAGE = '/library/{slug}/editor-v2/welsh'
export const ROUTE_FULL_PATH_DOWNLOAD = `${ROUTE_FULL_PATH_PAGE}/download`
export const ROUTE_FULL_PATH_UPLOAD = `${ROUTE_FULL_PATH_PAGE}/upload`
export const ROUTE_FULL_PATH_DELETE = `${ROUTE_FULL_PATH_PAGE}/delete`

const errorKey = sessionNames.validationFailure.editorTranslations

const translationsSchema = Joi.object()
  .keys({
    'form.title': Joi.string().allow(''),
    'form.submissionGuidance': Joi.string().allow(''),
    'form.privacyNoticeText': Joi.string().allow(''),
    'form.privacyNoticeUrl': Joi.string()
      .allow('')
      .uri()
      .allow('')
      .messages({ 'string.uri': 'The link format is invalid' }),
    'form.contact.email.address': Joi.string()
      .email()
      .allow('')
      .messages({ 'string.email': 'The email format is invalid' }),
    'form.contact.email.responseTime': Joi.string().allow(''),
    'form.contact.phone': Joi.string().allow(''),
    'form.contact.online.url': Joi.string()
      .uri()
      .allow('')
      .messages({ 'string.uri': 'The link format is invalid' }),
    'form.contact.online.text': Joi.string().allow('')
  })
  .pattern(
    // Validate unrecognised dynamic keys with a regex
    /^(?:(?:components|pages|listItems).[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}.(?:title|hint|shortDescription|errorDescription|text|content|instructionText|repeatTitle|paymentDescription))$/,
    Joi.string().trim().allow('')
  )
  .required()
  .messages({ 'object.unknown': 'Some invalid data keys were detected' })

const ERROR_MESSAGES = {
  SELECT_FILE: 'Select a file to upload',
  INVALID_XLSX_FILE: 'The selected file is not a valid XLSX file',
  INVALID_FORM_DEFINITION:
    'The selected file is not a valid translation file. {{ #reason }}',
  UPLOAD_FAILED: 'The selected file could not be uploaded'
}

const UPLOAD_SUCCESS_MESSAGE =
  'Your translations file was successfully uploaded'

/**
 * Custom Joi validator for file upload - ensures a file was selected and is valid XLSX
 * @param {any} value
 * @param {any} helpers
 */
export function validateFileSelected(value, helpers) {
  if (
    typeof value === 'object' &&
    !Buffer.isBuffer(value) &&
    Object.keys(value).length === 0
  ) {
    return helpers.error('any.required')
  }

  try {
    const workbook = xlsx.read(value)
    try {
      return validateWorkbook(workbook)
    } catch (err) {
      const error = /** @type {{ message?: string }} */ (err)
      return helpers.error('custom.invalidTranslationWorkbook', {
        reason: error.message
      })
    }
  } catch {
    return helpers.error('custom.invalidXlsx')
  }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageNum: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      const model = {
        ...translationsViewModel(metadata, definition, validation),
        notification
      }

      return h.view('forms/editor-v2/translations', model)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string | undefined }, Payload: Record<string, string> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      definition.metadata ??= {}
      definition.metadata.translations ??= {}
      // @ts-expect-error - dynamic language name
      definition.metadata.translations.cy = request.payload

      await forms.updateDraftFormDefinition(metadata.id, definition, token)

      yar.flash(
        sessionNames.successNotification,
        'Your Welsh translations have been saved to this session'
      )

      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: translationsSchema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_DOWNLOAD,
    async handler(request, h) {
      const { auth, params } = request
      const { slug } = params
      const { token } = auth.credentials

      try {
        const metadata = await forms.get(slug, token)
        const definition = await forms.getDraftFormDefinition(
          metadata.id,
          token
        )
        const buffer = getTranslationsAsExcel(metadata, definition)

        const now = new Date()
        const filename = `translations-${metadata.slug}-${format(now, 'yyyy-MM-dd')}.xlsx`

        return h
          .response(buffer)
          .header(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
          .header('Content-Disposition', `attachment; filename="${filename}"`)
      } catch (err) {
        logger.error(
          err,
          `[metrics] Error downloading translations - ${getErrorMessage(err)}`
        )
        throw err
      }
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormEdit}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_UPLOAD,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id
      const definition = await forms.getDraftFormDefinition(formId, token)

      const validation = yar.flash(errorKey).at(0)

      return h.view('forms/editor-v2/translations-upload', {
        ...uploadViewModel(metadata, definition, validation),
        downloadAction: editorv2Path(slug, 'welsh/download'),
        pageHeading: {
          text: 'Upload Welsh translations'
        }
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: any }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_UPLOAD,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      definition.metadata ??= {}
      definition.metadata.translations ??= {}
      // @ts-expect-error - dynamic language name
      definition.metadata.translations.cy = payload.translations

      await forms.updateDraftFormDefinition(metadata.id, definition, token)

      yar.flash(sessionNames.successNotification, UPLOAD_SUCCESS_MESSAGE)

      return h.redirect(editorv2Path(slug, 'welsh')).code(StatusCodes.SEE_OTHER)
    },
    options: {
      payload: {
        parse: true,
        multipart: {
          output: 'data'
        },
        maxBytes: 10 * 1024 * 1024 // 10MB limit
      },
      validate: {
        payload: Joi.object({
          translations: Joi.any()
            .required()
            .custom(validateFileSelected)
            .messages({
              'any.required': ERROR_MESSAGES.SELECT_FILE,
              'custom.invalidXlsx': ERROR_MESSAGES.INVALID_XLSX_FILE,
              'custom.invalidTranslationWorkbook':
                ERROR_MESSAGES.INVALID_FORM_DEFINITION
            })
        }),
        failAction: (request, h, error) => {
          const { yar, url } = request
          const { pathname: redirectTo } = url

          if (error && error instanceof Joi.ValidationError) {
            const formErrors = buildErrorDetails(error)
            yar.flash(errorKey, {
              formErrors,
              formValues: {}
            })
            return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
          }

          return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_DELETE,
    async handler(request, h) {
      const { auth, params } = request
      const { slug } = params
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        'forms/confirmation-page',
        deleteConfirmationPageViewModel(metadata, definition)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormEdit}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_DELETE,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // @ts-expect-error - dynamic type
      if (definition.metadata.translations.cy) {
        // @ts-expect-error - dynamic type
        delete definition.metadata.translations.cy
      }

      await forms.updateDraftFormDefinition(metadata.id, definition, token)

      yar.flash(
        sessionNames.successNotification,
        'Your Welsh translations have been deleted'
      )

      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormEdit}`] }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
