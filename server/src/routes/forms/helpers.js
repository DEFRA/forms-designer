import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as create from '~/src/models/forms/create.js'

/**
 * @template {Request<{ Payload: Pick<FormMetadataInput, 'title'> }>  | Request<{ Payload: FormMetadataInput }> | Request<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'title'> }>} RequestType
 * @param {RequestType} request
 * @param {ResponseToolkit<any>} h
 * @param {string} redirectPath
 */
export function redirectToTitleWithErrors(request, h, redirectPath) {
  const { yar, payload } = request

  yar.flash(sessionNames.validationFailure.createForm, {
    formErrors: create.titleFormErrors,
    formValues: payload
  })

  // Redirect POST to GET without resubmit on back button
  return h.redirect(redirectPath).code(StatusCodes.SEE_OTHER).takeover()
}

/**
 * @import { FormMetadataInput } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
