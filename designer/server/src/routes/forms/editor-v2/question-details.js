import { StatusCodes } from 'http-status-codes'

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
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createQuestionSessionState,
  getQuestionSessionState
} from '~/src/lib/session-helper.js'
import {
  allSpecificSchemas,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { baseSchema } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import {
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost
} from '~/src/routes/forms/editor-v2/question-details-helper.js'

export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details/{stateId?}`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

const schema = baseSchema.concat(allSpecificSchemas)

/**
 * @param {ResponseToolkit<{ Params: { slug: string, pageId: string, questionId: string, stateId?: string } }> | ResponseToolkit< { Payload: FormEditorInputQuestionDetails }>} h
 * @param {string} slug
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param { string | undefined } anchor
 */
function redirectWithAnchor(h, slug, pageId, questionId, stateId, anchor) {
  return h
    .redirect(
      editorv2Path(
        slug,
        `page/${pageId}/question/${questionId}/details/${stateId}${anchor}`
      )
    )
    .code(StatusCodes.SEE_OTHER)
}

/**
 * @param {string} formId
 * @param {string} token
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {Partial<ComponentDef>} questionDetails
 * @param {QuestionSessionState | undefined } state
 * @returns {Promise<string>}
 */
async function saveQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails,
  state
) {
  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      questionDetails,
      undefined,
      state
    )
    return newPage.id ?? 'unknown'
  } else if (questionId === 'new') {
    await addQuestion(formId, token, pageId, questionDetails, state)
  } else {
    await updateQuestion(
      formId,
      token,
      definition,
      pageId,
      questionId,
      questionDetails,
      state
    )
  }
  return pageId
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string, stateId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTION_DETAILS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth, query } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      // Set up session
      if (!stateId || !getQuestionSessionState(yar, stateId)) {
        const newStateId = createQuestionSessionState(yar)
        return redirectWithAnchor(h, slug, pageId, questionId, newStateId, '')
      }

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const state = buildQuestionSessionState(
        yar,
        stateId,
        definition,
        pageId,
        questionId
      )

      // Intercept operations if say a radio or checkbox
      const redirectAnchor = handleEnhancedActionOnGet(yar, stateId, query)
      if (redirectAnchor) {
        return redirectWithAnchor(
          h,
          slug,
          pageId,
          questionId,
          stateId,
          redirectAnchor
        )
      }

      return h.view(
        'forms/editor-v2/question-details',
        viewModel.questionDetailsViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          validation,
          state
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
   * @satisfies {ServerRoute<{ Payload: FormEditorInputQuestionDetails }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTION_DETAILS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId, questionId, stateId } =
        /** @type {{ slug: string, pageId: string, questionId: string, stateId: string }} */ (
          params
        )
      const { token } = auth.credentials

      const questionDetails = {
        ...mapQuestionDetails(payload),
        id: questionId !== 'new' ? questionId : undefined
      }

      // Intercept operations if say a radio or checkbox
      const redirectAnchor = handleEnhancedActionOnPost(
        yar,
        stateId,
        payload,
        questionDetails
      )
      if (redirectAnchor) {
        return redirectWithAnchor(
          h,
          slug,
          pageId,
          questionId,
          stateId,
          redirectAnchor
        )
      }

      // Save page and first question
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const state = getQuestionSessionState(yar, stateId)

      const finalPageId = await saveQuestion(
        metadata.id,
        token,
        definition,
        pageId,
        questionId,
        questionDetails,
        state
      )

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      clearQuestionSessionState(yar, stateId)

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
 * @import { ComponentDef, FormDefinition, FormEditorInputQuestionDetails, QuestionSessionState } from '@defra/forms-model'
 * @import { ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
