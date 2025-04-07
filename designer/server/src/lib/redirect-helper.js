import { StatusCodes } from 'http-status-codes'

import { addErrorsToSession } from '~/src/lib/error-helper.js'

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
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
