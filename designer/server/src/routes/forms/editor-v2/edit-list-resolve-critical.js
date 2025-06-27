import { StatusCodes } from 'http-status-codes'
import { validate as isValidUUID } from 'uuid'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-resolve-critical.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/edit-list/{stateId}/resolve-critical`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const state = getQuestionSessionState(yar, stateId)

      return h.view(
        'forms/editor-v2/edit-list-resolve-critical',
        viewModel.editListResolveCriticalViewModel(
          metadata,
          definition,
          state?.listConflicts ??
            /** @type {ListConflicts} */ ({
              critical: [],
              other: []
            }),
          {
            backText: 'Back to edit list',
            backUrl: `page/${pageId}/question/${questionId}/edit-list/${stateId}`
          },
          undefined,
          validation
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: { originalItem: string[] } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE,
    handler(request, h) {
      const { yar, params, payload } = request
      const { slug, pageId, questionId, stateId } = params
      const { originalItem } = payload

      const state = getQuestionSessionState(yar, stateId)

      // TODO - handle an array of posted values
      /** @type { ListItem | undefined } */
      let item
      const listItems = state?.listItems
      if (typeof originalItem === 'string') {
        if (!isValidUUID(originalItem)) {
          // Apply new item to conflict
          const conflict = state?.listConflicts?.critical[0].conflictItem
          item = listItems?.find((x) => x.id === conflict?.id)
        } else {
          item = listItems?.find((x) => x.id === originalItem)
        }

        if (item) {
          item.value = originalItem
          item.text = originalItem

          setQuestionSessionState(yar, stateId, {
            ...state,
            listItems
          })
        }
      }
      return h
        .redirect(
          editorv2Path(
            slug,
            `page/${pageId}/question/${questionId}/edit-list/${stateId}/resolve-other`
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
 * @import { ListConflicts, ListItem } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
