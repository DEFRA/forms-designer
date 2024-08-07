import { StatusCodes } from 'http-status-codes'

import * as create from '~/src/models/forms/create.js'

/**
 * @template {Request<{ Payload: any }> | Request<{ Params: any, Payload: any }>} RequestType
 * @param {RequestType} request
 * @param {ResponseToolkit<any>} h
 * @param {string} redirectPath
 */
export function redirectToTitleWithErrors(request, h, redirectPath) {
  const { yar, payload } = request

  yar.flash('validationFailure', {
    formErrors: create.titleFormErrors,
    formValues: payload
  })

  // Redirect POST to GET without resubmit on back button
  return h.redirect(redirectPath).code(StatusCodes.SEE_OTHER).takeover()
}

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
