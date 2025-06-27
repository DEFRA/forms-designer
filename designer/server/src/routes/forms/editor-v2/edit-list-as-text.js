import { randomUUID } from 'crypto'

import { questionDetailsFullSchema, randomId } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import { matchLists, upsertList, usedInConditions } from '~/src/lib/list.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { getComponentFromDefinition } from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-as-text.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_FROM_QUESTION = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/edit-list/{stateId}`
const ROUTE_FULL_PATH_FROM_CENTRAL = `/library/{slug}/editor-v2/list/{listId}`

const errorKey = sessionNames.validationFailure.editorQuestionDetails
const notificationKey = sessionNames.successNotification

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

const schemaManagement = schema.keys({
  listTitle: Joi.string().trim().required().messages({
    '*': 'Enter a title for the list'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_FROM_QUESTION,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const state = getQuestionSessionState(yar, stateId)

      return h.view(
        'forms/editor-v2/edit-list-as-text',
        viewModel.editListAsTextViewModel(
          metadata,
          definition,
          state?.listItems ?? [],
          {
            backText: 'Back to edit question',
            backUrl: `page/${pageId}/question/${questionId}/details/${stateId}`
          },
          false,
          '',
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
   * @satisfies {ServerRoute<{ Params: { slug: string, listId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_FROM_CENTRAL,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, listId } = params

      const { metadata, definition } = await getForm(slug, token)

      const list = definition.lists.find((x) => x.id === listId)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/edit-list-as-text',
        viewModel.editListAsTextViewModel(
          metadata,
          definition,
          /** @type {ListItem[]} */ (
            validation?.formValues.listAsText ?? list?.items
          ),
          {
            backText: 'Back to lists',
            backUrl: 'lists'
          },
          true,
          validation?.formValues.listTitle ?? list?.title,
          notification,
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
    path: ROUTE_FULL_PATH_FROM_QUESTION,
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
      const { additions, deletions, listItemsWithIds } = matchLists(
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
        setQuestionSessionState(yar, stateId, {
          ...state,
          listConflicts: /** @type {ListConflicts} */ ({
            critical: conditions.map((cond) => {
              return {
                conflictItem: {
                  id: cond.itemId,
                  text: cond.entryText ?? ''
                },
                conditionName: cond.displayName,
                linkableItems: deletions
                  .concat(additions)
                  .filter((x) => x.text !== cond.entryText)
              }
            }),
            other: additions.map((addit) => {
              return {
                conflictItem: {
                  id: addit.id,
                  text: addit.text
                },
                linkableItems: [
                  /** @type {Item} */ ({
                    text: 'Add as new item',
                    value: 'add-new'
                  }),
                  /** @type {Item} */ ({
                    text: 'Covered by conflict above',
                    value: 'covered-above'
                  })
                ].concat(deletions.filter((x) => x.text !== addit.text))
              }
            })
          })
        })
        const { pathname } = request.url
        return h.redirect(`${pathname}/resolve`)
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
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, listId: string }, Payload: { listAsText?: Item[] | string, listTitle?: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_FROM_CENTRAL,
    async handler(request, h) {
      const { yar, params, payload, auth } = request
      const { slug, listId } = params
      const { listAsText, listTitle } = payload
      const { token } = auth.credentials

      const { metadata, definition } = await getForm(slug, token)

      /** @type {List} */
      let listForSaving

      if (listId !== 'new') {
        const list = definition.lists.find((x) => x.id === listId)

        const { deletions, listItemsWithIds } = matchLists(
          definition,
          listId,
          /** @type {Item[]} */ (listAsText)
        )

        listForSaving = /** @type {List} */ ({
          ...list,
          title: listTitle,
          items: listItemsWithIds
        })

        const conditions = usedInConditions(definition, deletions, listId)
        if (conditions.length) {
          const error = createJoiError(
            'listAsText',
            `'${conditions[0].entryText}' has been deleted or edited but is referenced in condition '${conditions[0].displayName}'`
          )
          return redirectWithErrors(request, h, error, errorKey, '#')
        }
      } else {
        const name = randomId()
        listForSaving = {
          name,
          title: `List for common use ${name}`,
          type: 'string',
          items: /** @type {Item[]} */ (listAsText)
        }
      }

      // Save list
      await upsertList(metadata.id, definition, token, listForSaving)

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      return h.redirect(editorv2Path(slug, 'lists')).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schemaManagement,
        failAction: (request, h, error) => {
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
 * @import { Item, List, ListConflicts, ListItem } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
