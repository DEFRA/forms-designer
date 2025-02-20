import {
  dateSubSchema,
  questionTypeSchema,
  writtenAnswerSubSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as editor from '~/src/models/forms/editor-v2.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTION = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId?}`

const errorKey = sessionNames.validationFailure.editorQuestion

export const schema = Joi.object().keys({
  questionType: questionTypeSchema.messages({
    '*': 'Select the type of information you need from users or ask users to choose from a list'
  }),
  writtenAnswerSub: Joi.when('questionType', {
    is: 'written-answer-group',
    then: writtenAnswerSubSchema.messages({
      '*': 'Select the type of written answer you need from users'
    })
  }),
  dateSub: Joi.when('questionType', {
    is: 'date-group',
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
  if (questionType === 'written-answer-sub') {
    return writtenAnswerSub
  }
  if (questionType === 'date-sub') {
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
      const { slug } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const validation = yar.flash(errorKey).at(0)

      // TODO - supply payload
      return h.view(
        'forms/editor-v2/question',
        editor.addQuestionViewModel(metadata, {}, validation)
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormEditorInput, 'questionType' | 'writtenAnswerSub' | 'dateSub'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTION,
    handler(request, h) {
      const { params, payload, yar } = request
      const { slug, pageId, questionId } = params
      const { questionType, writtenAnswerSub, dateSub } = payload

      // Save in session until page is saved
      yar.set(
        sessionNames.questionType,
        deriveQuestionType(questionType, writtenAnswerSub, dateSub)
      )

      // Redirect to next page
      return h
        .redirect(
          editorv2Path(
            slug,
            `page/${pageId ?? 'first'}/question/${questionId ?? 'first'}/details`
          )
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
 * @import { FormEditorInput } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
