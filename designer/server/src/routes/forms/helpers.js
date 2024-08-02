import { StatusCodes } from 'http-status-codes'

import * as create from '~/src/models/forms/create.js'

/**
 * @param {RequestWithPayload} request
 * @param {ResponseToolkit} h
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
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */

/**
 * @typedef {import('@hapi/hapi').ResponseToolkit<any>} ResponseToolkit
 * @typedef {Request<{ Payload: any }>} RequestWithPayload
 */
