import { StatusCodes } from 'http-status-codes'
import { validate as isValidUUID } from 'uuid'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-resolve-other.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/edit-list/{stateId}/resolve-other`

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

      const otherConflictsPreFilter = state?.listConflicts?.other ?? []

      // Filter out any conflicts already resolved
      const listItemWithIds = state?.listItems
        ?.filter((x) => x.id !== undefined)
        .map((y) => y.text)
      const conflicts = otherConflictsPreFilter.filter(
        (x) => !listItemWithIds?.includes(x.conflictItem.text)
      )
      conflicts.forEach((x) => {
        x.linkableItems = [
          /** @type {Item} */ ({
            text: 'Add as new item',
            value: 'add-new'
          })
        ].concat(
          x.linkableItems.filter((y) => listItemWithIds?.includes(y.text))
        )
      })

      return h.view(
        'forms/editor-v2/edit-list-resolve-other',
        viewModel.editListResolveOtherViewModel(
          metadata,
          definition,
          { critical: [], other: conflicts },
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: { otherItem: string[] } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE,
    handler(request, h) {
      const { yar, params, payload } = request
      const { slug, pageId, questionId, stateId } = params
      const { otherItem } = payload

      const state = getQuestionSessionState(yar, stateId)

      // TODO - handle an array of otherItem(s)
      /** @type { ListItem | undefined } */
      let item
      const listItems = state?.listItems
      if (typeof otherItem === 'string') {
        if (!isValidUUID(otherItem)) {
          // Apply new item to conflict
          const conflict = state?.listConflicts?.other[0].conflictItem
          item = listItems?.find((x) => x.id === conflict?.id)
        } else {
          item = listItems?.find((x) => x.id === otherItem)
        }

        if (item) {
          item.value = otherItem
          item.text = otherItem

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
            `page/${pageId}/question/${questionId}/edit-list/${stateId}`
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
 * @import { Item, ListItem } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
