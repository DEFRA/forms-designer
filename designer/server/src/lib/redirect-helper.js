import { StatusCodes } from 'http-status-codes'

import { addErrorsToSession } from '~/src/lib/error-helper.js'

/**
 * @template T, S
 * @param { Request | Request<{ Payload: T }> | Request<{ Params: S, Payload: T }> } request
 * @param { ResponseToolkit | ResponseToolkit<{ Payload: T }> | ResponseToolkit<{ Params: S, Payload: T }> } h
 * @param {Error | undefined} error
 * @param {ValidationSessionKey} errorKey
 * @param {string} [anchor]
 */
export function redirectWithErrors(request, h, error, errorKey, anchor = '') {
  addErrorsToSession(request, errorKey, error)
  const { pathname: redirectTo, search } = request.url
  return h
    .redirect(`${redirectTo}${search || ''}${anchor}`)
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
