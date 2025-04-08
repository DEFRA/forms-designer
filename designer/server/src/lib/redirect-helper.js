import { StatusCodes } from 'http-status-codes'

import { addErrorsToSession, mapBoomError } from '~/src/lib/error-helper.js'

/**
 * @param {Request | Request<{ Payload: FormEditorInputQuestionDetails } >} request
 * @param {ResponseToolkit | ResponseToolkit<{ Payload: FormEditorInputQuestionDetails } >} h
 * @param {Error | undefined} error
 * @param {ValidationSessionKey} errorKey
 * @param {string} [anchor]
 */
export function redirectWithErrors(request, h, error, errorKey, anchor = '') {
  addErrorsToSession(request, error, errorKey)
  const { pathname: redirectTo } = request.url
  return h
    .redirect(`${redirectTo}${anchor}`)
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @param { Request | Request<{ Payload: FormEditorInputQuestionDetails }> } request
 * @param {ResponseToolkit | ResponseToolkit<{ Payload: FormEditorInputQuestionDetails }> } h
 * @param {Boom.Boom} boomError
 * @param {ValidationSessionKey} errorKey
 * @param {string} fieldName
 * @param {string} [anchor]
 */
export function redirectWithBoomError(
  request,
  h,
  boomError,
  errorKey,
  fieldName,
  anchor
) {
  const error = mapBoomError(errorKey, boomError, fieldName)

  request.yar.flash(errorKey, {
    formErrors: error,
    formValues: request.payload
  })

  const { pathname: redirectTo } = request.url
  return h
    .redirect(`${redirectTo}${anchor}`)
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
