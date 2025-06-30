import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { reorderPages } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import { getComponentsOnPageFromDefinition } from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages-reorder.js'
import { getFocus } from '~/src/models/forms/editor-v2/questions-helper.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_REORDER_QUESTIONS =
  '/library/{slug}/editor-v2/page/{pageId}/questions-reorder'

const reorderQuestionsKey = sessionNames.reorderQuestions

/**
 * @param {string|undefined} value
 * @returns {string[]}
 */
const customQuestionOrder = (value) => {
  if (value?.length) {
    return value.split(',')
  }

  return []
}

export const questionOrderSchema = Joi.object()
  .keys({
    saveChanges: Joi.boolean().default(false).optional(),
    movement: Joi.string().optional(),
    questionOrder: Joi.any().custom(customQuestionOrder)
  })
  .required()

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_REORDER_QUESTIONS,
    async handler(request, h) {
      const { params, auth, yar, query } = request
      const { token } = auth.credentials
      const { slug, pageId } = params
      const { focus } = /** @type {{focus: string}} */ (query)

      const focusObj = getFocus(focus)

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const components = getComponentsOnPageFromDefinition(definition, pageId)

      // Question reorder
      const questionOrder =
        getFlashFromSession(yar, reorderQuestionsKey) ??
        components
          .map((x) => `${x.id}`)
          .join(',')

      return h.view(
        'forms/editor-v2/questions-reorder',
        viewModel.questionsReorderViewModel(
          metadata,
          definition,
          questionOrder,
          focusObj
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string }, Payload: Pick<FormEditorInputPage, 'movement' | 'questionOrder'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_REORDER_QUESTIONS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId } = params
      const { movement, questionOrder, saveChanges } =
        /** @type {{ movement: string, questionOrder: string[], saveChanges: boolean}} */ (
          payload
        )

      if (saveChanges) {
        const { token } = auth.credentials
        const metadata = await forms.get(slug, token)

        if (questionOrder.length > 0) {
          await reorderQuestions(metadata.id, token, questionOrder)
        }
        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)
        yar.clear(reorderQuestionsKey)

        return h
          .redirect(editorv2Path(slug, `page/${pageId}/questions`))
          .code(StatusCodes.SEE_OTHER)
          .takeover()
      }

      if (movement) {
        const [direction, questionId] = movement.split('|')

        const newQuestionOrder = repositionQuestion(questionOrder, direction, questionId).join(
          ','
        )

        setFlashInSession(yar, reorderQuestionsKey, newQuestionOrder)

        return h
          .redirect(editorv2Path(slug, `page/${pageId}/questions-reorder?focus=${movement}`))
          .code(StatusCodes.SEE_OTHER)
      }

      return h
        .redirect(editorv2Path(slug, `page/${pageId}/questions-reorder`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: questionOrderSchema
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
