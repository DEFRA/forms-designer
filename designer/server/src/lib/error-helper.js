import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {Request | Request<{ Payload: FormEditorInputQuestionDetails } >} request
 * @param {Error} [error]
 * @param {ValidationSessionKey} [flashKey]
 */
export function addErrorsToSession(request, error, flashKey) {
  const { payload, yar } = request

  if (error && error instanceof Joi.ValidationError) {
    const formErrors = buildErrorDetails(error)

    yar.flash(flashKey, {
      formErrors,
      formValues: payload
    })
  }
}

/**
 * @param {Yar} yar
 * @param {string} errorKey
 */
export function getValidationErrorsFromSession(yar, errorKey) {
  const errors = /** @type {ValidationFailure<FormEditor>[] | undefined} */ (
    yar.flash(errorKey)
  )
  return /** @type {ValidationFailure<FormEditor> | undefined} */ (
    errors?.at(0)
  )
}

/**
 * @param {ValidationSessionKey} errorKey
 * @param {Boom.Boom} boomError
 * @param {string} [fieldName]
 */
export function mapBoomError(errorKey, boomError, fieldName) {
  const boomMessage = boomError.data?.message
  let message = boomMessage ?? 'An error occurred'
  if (boomMessage.startsWith('Duplicate page path')) {
    if (errorKey === sessionNames.validationFailure.editorQuestionDetails) {
      message =
        'Page path (derived from first question text) already exists on another page'
    } else if (errorKey === sessionNames.validationFailure.editorPage) {
      message =
        'Page path (derived from page heading) already exists on another page'
    }
  }

  return {
    [fieldName ?? 'general']: {
      text: message,
      href: `#${fieldName ?? 'general'}`
    }
  }
}
/**
 * @import { FormEditor, FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { Request } from '@hapi/hapi'
 * @import { ValidationSessionKey, Yar } from '@hapi/yar'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
