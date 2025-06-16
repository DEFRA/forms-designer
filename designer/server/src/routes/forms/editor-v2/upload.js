import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/upload.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_PATH_UPLOAD = 'upload'
export const ROUTE_FULL_PATH_UPLOAD = '/library/{slug}/editor-v2/upload'

const notificationKey = sessionNames.successNotification
const errorKey = sessionNames.validationFailure.upload

const ERROR_MESSAGES = {
  SELECT_FILE: 'Select a file to upload',
  INVALID_JSON_FILE: 'The selected file is not a valid JSON file',
  INVALID_FORM_DEFINITION: 'The selected file is not a valid form definition',
  UPLOAD_FAILED: 'The selected file could not be uploaded'
}

const SUCCESS_MESSAGE = 'Form uploaded successfully'

/**
 * Flash error message and redirect
 * @param {any} h
 * @param {any} yar
 * @param {string} slug
 * @param {string} errorMessage
 */
export function flashErrorAndRedirect(h, yar, slug, errorMessage) {
  yar.flash(errorKey, {
    formErrors: {
      formDefinition: {
        text: errorMessage,
        href: '#formDefinition'
      }
    },
    formValues: {}
  })
  return h
    .redirect(ROUTE_FULL_PATH_UPLOAD.replace('{slug}', slug))
    .code(StatusCodes.SEE_OTHER)
}

/**
 * Validate form definition structure
 * @param {any} definition
 */
export function isValidFormDefinition(definition) {
  return !!(
    definition &&
    typeof definition === 'object' &&
    definition.pages &&
    Array.isArray(definition.pages)
  )
}

/**
 * Custom Joi validator for file upload - ensures a file was selected and is valid JSON
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

  if (typeof value === 'object' && !Buffer.isBuffer(value)) {
    return value
  }

  try {
    const jsonString = Buffer.isBuffer(value)
      ? value.toString('utf8')
      : String(value)
    return JSON.parse(jsonString)
  } catch {
    return helpers.error('custom.invalidJson')
  }
}

export default [
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

      return h.view(
        'forms/editor-v2/upload',
        viewModel.uploadViewModel(metadata, definition, validation)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
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
      const formId = metadata.id
      const formDefinition = payload.formDefinition

      const definition = formDefinition

      if (!isValidFormDefinition(definition)) {
        return flashErrorAndRedirect(
          h,
          yar,
          slug,
          ERROR_MESSAGES.INVALID_FORM_DEFINITION
        )
      }

      try {
        await forms.updateDraftFormDefinition(formId, definition, token)
      } catch {
        return flashErrorAndRedirect(h, yar, slug, ERROR_MESSAGES.UPLOAD_FAILED)
      }

      yar.flash(notificationKey, SUCCESS_MESSAGE)
      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
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
          formDefinition: Joi.any()
            .required()
            .custom(validateFileSelected)
            .messages({
              'any.required': ERROR_MESSAGES.SELECT_FILE,
              'custom.invalidJson': ERROR_MESSAGES.INVALID_JSON_FILE
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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
