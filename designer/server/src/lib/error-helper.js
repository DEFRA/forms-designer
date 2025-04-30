import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'

/**
 * @template T
 * @param { Request | Request<{ Payload: T }> } request
 * @param {Error} [error]
 * @param {ValidationSessionKey} [flashKey]
 */
export function addErrorsToSession(request, error, flashKey) {
  const { payload } = request

  flashErrorsToSession(request, payload, error, flashKey)
}

/**
 * @template T
 * @param { Request | Request<{ Payload: T }> } request
 * @param {unknown} formValues
 * @param {Error} [error]
 * @param {ValidationSessionKey} [flashKey]
 */
export function flashErrorsToSession(request, formValues, error, flashKey) {
  const { yar } = request

  if (error && error instanceof Joi.ValidationError) {
    const formErrors = buildErrorDetails(error)

    yar.flash(flashKey, {
      formErrors,
      formValues
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
 * Common error used when page title is mandatory
 * @returns {Joi.ValidationError}
 */
export function pageTitleError() {
  return createJoiError(
    'pageHeading',
    'Pages with more than one question must include a page heading'
  )
}

/**
 * Dispatch the request to page settings with an error
 * @param { Request | Request<any> } request
 * @param {ResponseToolkit<any>} h - the response toolkit
 * @param {string} path - the path to redirect to
 */
export function dispatchToPageTitle(request, h, path) {
  const errorKey = sessionNames.validationFailure.editorQuestions

  flashErrorsToSession(
    request,
    {
      pageHeadingAndGuidance: 'true'
    },
    pageTitleError(),
    errorKey
  )

  return h.redirect(path).code(StatusCodes.SEE_OTHER)
}

/**
 * @import { FormEditor } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey, Yar } from '@hapi/yar'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
