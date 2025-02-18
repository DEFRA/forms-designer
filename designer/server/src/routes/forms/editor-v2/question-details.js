import {
  hintTextSchema,
  questionOptionalSchema,
  questionSchema,
  shortDescriptionSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import { addErrorsToSession } from '~/src/lib/validation.js'
import * as editor from '~/src/models/forms/editor-v2.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details`

export const baseSchema = Joi.object().keys({
  question: questionSchema.messages({
    '*': 'Enter a question'
  }),
  hintText: hintTextSchema,
  questionOptional: questionOptionalSchema,
  shortDescription: shortDescriptionSchema.messages({
    '*': 'Select a short description'
  })
})

const specificsSchema = Joi.object()

const schema = baseSchema.concat(specificsSchema)

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTION_DETAILS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const validation = yar
        .flash(sessionNames.validationFailure.editorQuestionDetails)
        .at(0)

      // TODO - supply payload
      return h.view(
        'forms/editor-v2/question-details',
        editor.addQuestionDetailsViewModel(metadata, {}, validation)
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
    path: ROUTE_FULL_PATH_QUESTION_DETAILS,
    handler(request, h) {
      const { params } = request
      const { slug, pageNum } = params

      // Redirect to next page
      return h
        .redirect(editorv2Path(slug, `page/${pageNum}/questions`))
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
    sessionNames.validationFailure.editorQuestionDetails
  )
  return h
    .redirect(request.url.toString())
    .code(StatusCodes.SEE_OTHER)
    .takeover()
}

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
