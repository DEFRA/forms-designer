import {
  dateSubSchema,
  questionTypeSchema,
  writtenAnswerSubSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  QUESTION_TYPE_DATE_GROUP,
  QUESTION_TYPE_WRITTEN_ANSWER_GROUP
} from '~/src/common/constants/editor.js'
import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-type.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTION = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}`

const errorKey = sessionNames.validationFailure.editorQuestion

export const schema = Joi.object().keys({
  questionType: questionTypeSchema.messages({
    '*': 'Select the type of information you need from users or ask users to choose from a list'
  }),
  writtenAnswerSub: Joi.when('questionType', {
    is: QUESTION_TYPE_WRITTEN_ANSWER_GROUP,
    then: writtenAnswerSubSchema.messages({
      '*': 'Select the type of written answer you need from users'
    })
  }),
  dateSub: Joi.when('questionType', {
    is: QUESTION_TYPE_DATE_GROUP,
    then: dateSubSchema.messages({
      '*': 'Select the type of date you need from users'
    })
  })
})

/**
 *
 * @param {string} questionType
 * @param {string} writtenAnswerSub - sub-type if 'written-answer-sub' selected in questionType
 * @param {string} dateSub - sub-type if 'date-sub' selected in questionType
 */
export function deriveQuestionType(questionType, writtenAnswerSub, dateSub) {
  if (questionType === QUESTION_TYPE_WRITTEN_ANSWER_GROUP) {
    return writtenAnswerSub
  }
  if (questionType === QUESTION_TYPE_DATE_GROUP) {
    return dateSub
  }
  return questionType
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTION,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string }} */ (
          params
        )

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      return h.view(
        'forms/editor-v2/question',
        viewModel.questionTypeViewModel(
          metadata,
          definition,
          pageId,
          questionId,
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormEditorInputPage, 'questionType' | 'writtenAnswerSub' | 'dateSub'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTION,
    handler(request, h) {
      const { params, payload, yar } = request
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string}} */ (
          params
        )
      const { questionType, writtenAnswerSub, dateSub } = payload

      // Save in session until page is saved
      yar.set(
        sessionNames.questionType,
        deriveQuestionType(questionType, writtenAnswerSub, dateSub)
      )

      // Redirect to next page
      return h
        .redirect(
          editorv2Path(slug, `page/${pageId}/question/${questionId}/details`)
        )
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
