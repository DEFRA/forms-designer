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
import {
  addPageAndFirstQuestion,
  addQuestion,
  updateQuestion
} from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { isCheckboxSelected, stringHasValue } from '~/src/lib/utils.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

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

// To be extended with question specific fields
const specificsSchema = Joi.object()

const schema = baseSchema.concat(specificsSchema)

/**
 *
 * @param {Partial<FormEditorInputQuestion>} payload
 * @param {string} questionType
 */
function mapQuestionDetails(payload, questionType) {
  return /** @type {Partial<ComponentDef>} */ ({
    type: questionType,
    title: payload.question,
    name: payload.shortDescription,
    hint: payload.hintText,
    options: {
      required: !isCheckboxSelected(payload.questionOptional)
    }
  })
}

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
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string }} */ (
          params
        )

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      return h.view(
        'forms/editor-v2/question-details',
        viewModel.questionDetailsViewModel(
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormEditorInputQuestion, 'question' | 'hintText' | 'shortDescription' | 'questionOptional'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTION_DETAILS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string}} */ (
          params
        )
      const { token } = auth.credentials

      const questionType = /** @type {string} */ (
        `${yar.get(sessionNames.questionType)}`
      )
      if (!stringHasValue(questionType)) {
        throw new Error('Missing question type')
      }

      const questionDetails = {
        ...mapQuestionDetails(payload, questionType),
        id: questionId !== 'new' ? questionId : undefined
      }

      // Save page and first question
      const metadata = await forms.get(slug, token)
      let finalPageId = pageId

      if (pageId === 'new') {
        const newPage = await addPageAndFirstQuestion(
          metadata.id,
          token,
          questionDetails
        )
        finalPageId = newPage.id ?? 'unknown'
      } else if (questionId === 'new') {
        await addQuestion(metadata.id, token, pageId, questionDetails)
      } else {
        await updateQuestion(
          metadata.id,
          token,
          pageId,
          questionId,
          questionDetails
        )
      }

      // Redirect to next page
      return h
        .redirect(editorv2Path(slug, `page/${finalPageId}/questions`))
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
 * @import { FormEditorInputQuestion, ComponentDef } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
