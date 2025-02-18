import Joi from 'joi'

import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {Request} request
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
 * @import { Request } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
