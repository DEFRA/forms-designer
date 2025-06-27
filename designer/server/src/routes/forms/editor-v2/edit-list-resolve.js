import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-resolve.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/edit-list/{stateId}/resolve`

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
        'forms/editor-v2/edit-list-resolve',
        viewModel.editListResolveViewModel(
          metadata,
          definition,
          state?.listConflicts ??
            /** @type {ListConflicts} */ ({
              critical: [],
              other: [],
              deletions: []
            }),
          {
            backText: 'Back to edit question',
            backUrl: `page/${pageId}/question/${questionId}/details/${stateId}`
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: { originalItem: string[], otherItem?: string[] } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE,
    async handler(request, h) {
      const { yar, params, payload, auth } = request
      const { slug, pageId, questionId, stateId } = params
      const { originalItem } = payload
      const { token } = auth.credentials

      const { definition } = await getForm(slug, token)

      const state = getQuestionSessionState(yar, stateId)

      // eslint-disable-next-line no-console
      console.log('state conflicts', state?.listConflicts)
      // eslint-disable-next-line no-console
      console.log('def name', definition.name)
      // eslint-disable-next-line no-console
      console.log('originalItem', originalItem)

      /*
      setQuestionSessionState(yar, stateId, {
        ...state,
        listItems: listItemsWithIds.map((item) => {
          return {
            ...item,
            id: item.id ?? randomUUID()
          }
        })
      })
      */
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
 * @import { ListConflicts } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
