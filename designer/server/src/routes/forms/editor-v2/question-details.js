import {
  classesSchema,
  hintTextSchema,
  maxLengthSchema,
  minLengthSchema,
  nameSchema,
  questionOptionalSchema,
  questionSchema,
  questionTypeFullSchema,
  regexSchema,
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
import { isCheckboxSelected } from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import { getQuestionType } from '~/src/routes/forms/editor-v2/helper.js'

export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

export const baseSchema = Joi.object().keys({
  name: nameSchema,
  question: questionSchema.messages({
    '*': 'Enter a question'
  }),
  hintText: hintTextSchema,
  questionOptional: questionOptionalSchema,
  shortDescription: shortDescriptionSchema.messages({
    '*': 'Enter a short description'
  }),
  questionType: questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  })
})

// To be extended with question specific fields
const specificsSchema = Joi.object().keys({
  minLength: minLengthSchema.messages({
    '*': 'Minimum length must be a number greater than zero'
  }),
  maxLength: maxLengthSchema.messages({
    '*': 'Maximum length must be a number greater than zero'
  }),
  regex: regexSchema,
  classes: classesSchema
})

const schema = baseSchema.concat(specificsSchema)

/**
 *
 * @param {Partial<FormEditorInputQuestion>} payload
 */
function mapQuestionDetails(payload) {
  return /** @type {Partial<ComponentDef>} */ ({
    type: payload.questionType,
    title: payload.question,
    name: payload.name,
    shortDescription: payload.shortDescription,
    hint: payload.hintText,
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      classes: payload.classes
    },
    schema: {
      min: payload.minLength ?? undefined,
      max: payload.maxLength ?? undefined,
      regex: payload.regex ?? undefined
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

      const questionType = getQuestionType(yar, validation?.formValues)

      return h.view(
        'forms/editor-v2/question-details',
        viewModel.questionDetailsViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          questionType,
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

      const questionDetails = {
        ...mapQuestionDetails(payload),
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

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

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
