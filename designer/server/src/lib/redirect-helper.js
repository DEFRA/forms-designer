import { StatusCodes } from 'http-status-codes'

import { addErrorsToSession } from '~/src/lib/error-helper.js'

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {Error | undefined} error
 * @param {ValidationSessionKey} errorKey
 * @param {boolean} [removeAnchor]
 */
export function redirectWithErrors(request, h, error, errorKey, removeAnchor) {
  addErrorsToSession(request, error, errorKey)
  const { pathname: redirectTo } = request.url
  if (removeAnchor) {
    const [withoutAnchor] = redirectTo.split('#')
    return h
      .redirect(`${withoutAnchor}#`)
      .code(StatusCodes.SEE_OTHER)
      .takeover()
  }
  return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
}

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
