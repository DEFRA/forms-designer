import { StatusCodes } from 'http-status-codes'

import { addErrorsToSession } from '~/src/lib/error-helper.js'
import { editorv2Path } from '~/src/models/links.js'

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
  const { pathname: redirectTo, search } = request.url
  return h
    .redirect(`${redirectTo}${search || ''}${anchor}`)
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @param {ResponseToolkit<{ Params: { slug: string, pageId: string, questionId: string, stateId?: string } }> | ResponseToolkit< { Payload: FormEditorInputQuestionDetails }> | ResponseToolkit<{ Params: { slug: string, conditionId: string, stateId?: string } }>} h
 * @param {string} slug
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param {string} anchorOrUrl - anchor (starting with '#') or a relative url
 * @param {string} [urlTemplate] - override default url structure
 */
export function redirectWithAnchorOrUrl(
  h,
  slug,
  pageId,
  questionId,
  stateId,
  anchorOrUrl,
  urlTemplate
) {
  return h
    .redirect(
      editorv2Path(
        slug,
        urlTemplate ??
          `page/${pageId}/question/${questionId}/details/${stateId}${anchorOrUrl}`
      )
    )
    .code(StatusCodes.SEE_OTHER)
}

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 */
