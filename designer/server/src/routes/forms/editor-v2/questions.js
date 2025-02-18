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
import { addErrorsToSession } from '~/src/lib/validation.js'
import * as editor from '~/src/models/forms/editor-v2.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTIONS = `/library/{slug}/editor-v2/page/{pageId}/questions`

export const ROUTE_PATH_QUESTION_DETAILS =
  '/library/{slug}/editor-v2/page/{pageId}/question/{questionId}'

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

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTIONS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const page = definition.pages[0]
      const components = 'components' in page ? page.components : []
      const validation = yar
        .flash(sessionNames.validationFailure.editorQuestions)
        .at(0)

      // TODO - supply payload

      return h.view(
        'forms/editor-v2/questions',
        editor.questionsViewModel(metadata, components, {}, validation)
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormEditorInput, 'questionType'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTIONS,
    handler(request, h) {
      const { params } = request
      const { slug, pageId, questionId } = params

      // TODO - to call API to get question guid back
      // const questionId = await API.saveQuestion()

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
        failAction: redirectToStepWithErrors
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
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {Error} [error]
 */
export function redirectToStepWithErrors(request, h, error) {
  addErrorsToSession(
    request,
    error,
    sessionNames.validationFailure.editorQuestions
  )
  return h
    .redirect(request.url.toString())
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
