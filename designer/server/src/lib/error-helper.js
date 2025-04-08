import Joi from 'joi'

import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'

/**
 * @template T
 * @param {Request | Request<{ Payload: T }> } request
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
 * @import { FormEditor } from '@defra/forms-model'
 * @import { Request } from '@hapi/hapi'
 * @import { ValidationSessionKey, Yar } from '@hapi/yar'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
