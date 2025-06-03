import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import * as forms from '~/src/lib/forms.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-delete.js'
import { editorv2Path } from '~/src/models/links.js'

const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details/{stateId}/delete-list-item/{itemId}`
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string, itemId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId, itemId } = params

      const metadata = await forms.get(slug, token)
      const formDefinition = await forms.getDraftFormDefinition(
        metadata.id,
        token
      )

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.deleteListItemConfirmationPageViewModel(
          getQuestionSessionState(yar, stateId),
          metadata,
          formDefinition,
          pageId,
          questionId,
          stateId,
          itemId
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string, itemId: string }}>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    handler(request, h) {
      const { yar, params } = request
      const { slug, pageId, questionId, stateId, itemId } = params

      const state = getQuestionSessionState(yar, stateId)
      const newList = state?.listItems?.filter((x) => x.id !== itemId)
      setQuestionSessionState(yar, stateId, {
        ...state,
        listItems: newList
      })

      // Redirect POST to GET
      return h
        .redirect(
          editorv2Path(
            slug,
            `page/${pageId}/question/${questionId}/details/${stateId}#list-items`
          )
        )
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { FormEditorInputPage, FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
