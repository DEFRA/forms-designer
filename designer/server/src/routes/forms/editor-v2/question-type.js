import {
  QuestionTypeSubGroup,
  Scopes,
  dateSubSchema,
  listSubSchema,
  locationSubSchema,
  questionTypeSchema,
  writtenAnswerSubSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  dispatchToPageTitle,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  createQuestionSessionState,
  getQuestionSessionState,
  mergeQuestionSessionState
} from '~/src/lib/session-helper.js'
import { requiresPageTitle } from '~/src/lib/utils.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-type.js'
import { editorv2Path } from '~/src/models/links.js'
import { getFormPage } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_FULL_PATH_QUESTION =
  '/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/type/{stateId?}'
const ROUTE_FULL_PATH_QUESTION_WITH_STATE =
  '/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/type/{stateId}'

const errorKey = sessionNames.validationFailure.editorQuestion

export const schema = Joi.object().keys({
  questionType: questionTypeSchema.messages({
    '*': 'Select the type of information you need from users or ask users to choose from a list'
  }),
  writtenAnswerSub: Joi.when('questionType', {
    is: QuestionTypeSubGroup.WrittenAnswerSubGroup,
    then: writtenAnswerSubSchema.messages({
      '*': 'Select the type of written answer you need from users'
    })
  }),
  dateSub: Joi.when('questionType', {
    is: QuestionTypeSubGroup.DateSubGroup,
    then: dateSubSchema.messages({
      '*': 'Select the type of date you need from users'
    })
  }),
  locationSub: Joi.when('questionType', {
    is: QuestionTypeSubGroup.LocationSubGroup,
    then: locationSubSchema.messages({
      '*': 'Select the type of location you require'
    })
  }),
  listSub: Joi.when('questionType', {
    is: QuestionTypeSubGroup.ListSubGroup,
    then: listSubSchema.messages({
      '*': 'Select the type of list you need from users'
    })
  })
})

/**
 *
 * @param {string | undefined} questionType
 * @param {string | undefined} writtenAnswerSub - sub-type if 'written-answer-sub' selected in questionType
 * @param {string | undefined} dateSub - sub-type if 'date-sub' selected in questionType
 * @param {string | undefined} locationSub - sub-type if 'location-sub' selected in questionType
 * @param {string | undefined} listSub - sub-type if 'list-sub' selected in questionType
 */
export function deriveQuestionType(
  questionType,
  writtenAnswerSub,
  dateSub,
  locationSub,
  listSub
) {
  if (questionType === QuestionTypeSubGroup.WrittenAnswerSubGroup) {
    return writtenAnswerSub
  }
  if (questionType === QuestionTypeSubGroup.DateSubGroup) {
    return dateSub
  }
  if (questionType === QuestionTypeSubGroup.LocationSubGroup) {
    return locationSub
  }
  if (questionType === QuestionTypeSubGroup.ListSubGroup) {
    return listSub
  }
  return /** @type {string | undefined} */ questionType
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId?: string }, Payload: undefined }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTION,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      // Form metadata and page components
      const { page, metadata, definition } = await getFormPage(
        slug,
        pageId,
        token
      )

      // Ensure there's a page title when adding multiple questions
      if (questionId === 'new' && requiresPageTitle(page)) {
        return dispatchToPageTitle(
          request,
          h,
          editorv2Path(slug, `page/${pageId}/questions`)
        )
      }

      // Set up session if not yet exists
      if (!stateId || !getQuestionSessionState(yar, stateId)) {
        const newStateId = createQuestionSessionState(yar)
        return h
          .redirect(
            editorv2Path(
              slug,
              `page/${pageId}/question/${questionId}/type/${newStateId}`
            )
          )
          .code(StatusCodes.SEE_OTHER)
      }

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const state = getQuestionSessionState(yar, stateId)

      return h.view(
        'forms/editor-v2/question',
        viewModel.questionTypeViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          state,
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId: string }, Payload: Pick<FormEditorInputPage, 'questionType' | 'writtenAnswerSub' | 'dateSub' | 'locationSub' | 'listSub'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTION_WITH_STATE,
    async handler(request, h) {
      const { params, payload, yar, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      // Form metadata and page components
      const { page } = await getFormPage(slug, pageId, token)

      // Ensure there's a page title when adding multiple questions
      if (questionId === 'new' && requiresPageTitle(page)) {
        return dispatchToPageTitle(
          request,
          h,
          editorv2Path(slug, `page/${pageId}/questions`)
        )
      }

      const { questionType, writtenAnswerSub, dateSub, locationSub, listSub } =
        payload

      const suppliedQuestionType =
        /** @type {ComponentType} */
        (
          deriveQuestionType(
            questionType,
            writtenAnswerSub,
            dateSub,
            locationSub,
            listSub
          )
        )

      // Get existing state to check if type changed
      const existingState = getQuestionSessionState(yar, stateId)
      const oldType = existingState?.questionType
      const typeChanged = oldType && oldType !== suppliedQuestionType

      // Only clear questionDetails when switching to/from location fields
      // (e.g., short answer to long answer)
      const shouldClearDetails =
        typeChanged &&
        (isLocationFieldType(oldType) ||
          isLocationFieldType(suppliedQuestionType))

      // Update question type in session
      mergeQuestionSessionState(yar, stateId, {
        questionType: suppliedQuestionType,
        questionDetails: shouldClearDetails
          ? undefined
          : existingState?.questionDetails
      })

      // Redirect to next page
      return h
        .redirect(
          editorv2Path(
            slug,
            `page/${pageId}/question/${questionId}/details/${stateId}`
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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { ComponentType, FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
