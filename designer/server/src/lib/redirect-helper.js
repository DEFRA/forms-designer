import { StatusCodes } from 'http-status-codes'

import { mapBoomError } from '~/src/lib/error-boom-helper.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'

/**
 * @template T
 * @param { Request | Request<{ Payload: T } > } request
 * @param { ResponseToolkit | ResponseToolkit<{ Payload: T }> } h
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
 * @template T
 * @param { Request | Request<{ Payload: T }> } request
 * @param { ResponseToolkit | ResponseToolkit<{ Payload: T }> } h
 * @param {Boom.Boom} boomError
 * @param {ValidationSessionKey} errorKey
 * @param {string} [fieldName]
 * @param {string} [anchor]
 */
export function redirectWithBoomError(
  request,
  h,
  boomError,
  errorKey,
  fieldName,
  anchor = ''
) {
  const error = mapBoomError(errorKey, boomError, fieldName)

  return redirectWithErrors(request, h, error, errorKey, anchor)
}

/**
 * @import { FormEditorInputPageSettings, FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
