import { randomUUID } from 'crypto'

import { questionDetailsFullSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import { matchLists, usedInConditions } from '~/src/lib/list.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { getComponentFromDefinition } from '~/src/lib/utils.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-as-text.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/edit-list/{stateId}`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

const schema = Joi.object().keys({
  listAsText: questionDetailsFullSchema.autoCompleteOptionsSchema.messages({
    'array.min': 'Enter at least one option for users to choose from',
    'array.includes': 'Enter options separated by a colon',
    'dsv.invalid': 'Enter options separated by a colon',
    'string.min': 'Enter at least one character',
    'string.empty': 'Enter at least one character',
    'array.unique': 'Duplicate option found'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      return h.view(
        'forms/editor-v2/edit-list-as-text',
        viewModel.editListAsTextViewModel(
          getQuestionSessionState(yar, stateId),
          metadata,
          definition,
          pageId,
          questionId,
          stateId,
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: { listAsText?: Item[] | string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { yar, params, payload, auth } = request
      const { slug, pageId, questionId, stateId } = params
      const { listAsText } = payload
      const { token } = auth.credentials

      const { definition } = await getForm(slug, token)

      const component = getComponentFromDefinition(
        definition,
        pageId,
        questionId
      )
      const listName = component && 'list' in component ? component.list : ''
      const { deletions, listItemsWithIds } = matchLists(
        definition,
        listName,
        /** @type {Item[]} */ (listAsText)
      )

      const state = getQuestionSessionState(yar, stateId)
      setQuestionSessionState(yar, stateId, {
        ...state,
        listItems: listItemsWithIds.map((item) => {
          return {
            ...item,
            id: item.id ?? randomUUID()
          }
        })
      })

      const conditions = usedInConditions(definition, deletions, listName)
      if (conditions.length) {
        const error = createJoiError(
          'listAsText',
          `'${conditions[0].entryText}' has been deleted or edited but is referenced in condition '${conditions[0].displayName}'`
        )
        return redirectWithErrors(request, h, error, errorKey, '#')
      }

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
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          const state =
            getQuestionSessionState(request.yar, request.params.stateId) ?? {}
          const { listAsText } = /** @type {{ listAsText: string }} */ (
            request.payload
          )
          // @ts-expect-error - should be an array but remains a string if validation failure
          state.listItems = listAsText
          return redirectWithErrors(request, h, error, errorKey, '#')
        }
      },
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
 * @import { Item } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
