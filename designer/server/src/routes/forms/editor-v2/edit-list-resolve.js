import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import {
  clearQuestionSessionState,
  getQuestionSessionState
} from '~/src/lib/session-helper.js'
import { getComponentFromDefinition } from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/edit-list-resolve.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm, getFormPage } from '~/src/routes/forms/editor-v2/helpers.js'
import { saveQuestion } from '~/src/routes/forms/editor-v2/question-details-helper-ext.js'

const ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details/{stateId}/resolve`

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

      const question = getComponentFromDefinition(
        definition,
        pageId,
        questionId
      )

      return h.view(
        'forms/editor-v2/edit-list-resolve',
        viewModel.editListResolveViewModel(
          metadata,
          definition,
          question,
          state?.listConflicts ?? [],
          {
            backText: 'Back to question details',
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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: { replaceWith: string[] } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_FROM_QUESTION_RESOLVE,
    async handler(request, h) {
      const { yar, params, payload, auth } = request
      const { slug, pageId, questionId, stateId } = params
      const { replaceWith } = payload
      const { token } = auth.credentials

      const state = getQuestionSessionState(yar, stateId)

      const listItems = state?.listItems

      // Apply value replacement
      Object.entries(replaceWith).forEach(([replaceId, replaceValue]) => {
        const item = listItems?.find((x) => x.id === replaceId)
        if (item) {
          item.value = replaceValue
          item.text = replaceValue
        }
      })

      // Get details
      const { metadata, definition } = await getFormPage(slug, pageId, token)

      await saveQuestion(
        metadata.id,
        token,
        definition,
        pageId,
        questionId,
        state?.questionDetails ?? {},
        /** @type {Item[]} */ (listItems)
      )

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      clearQuestionSessionState(yar, stateId)

      return h
        .redirect(editorv2Path(slug, `page/${pageId}/questions`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      },
      validate: {
        payload: Joi.object({
          replaceWith: Joi.object().required()
        })
      }
    }
  })
]

/**
 * @import { Item } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
