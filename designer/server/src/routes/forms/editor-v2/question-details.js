import { ComponentType } from '@defra/forms-model'
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
import { buildAutoCompleteListFromPayload, upsertList } from '~/src/lib/list.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  allSpecificSchemas,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { baseSchema } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import { getQuestionType } from '~/src/routes/forms/editor-v2/helper.js'
import {
  getEnhancedActionStateFromSession,
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost
} from '~/src/routes/forms/editor-v2/question-details-helper.js'

export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

const schema = baseSchema.concat(allSpecificSchemas)

/**
 * @param {ResponseToolkit<{ Params: { slug: string, pageId: string, questionId: string } }> | ResponseToolkit< { Payload: FormEditorInputQuestionDetails }>} h
 * @param {string} slug
 * @param {string} pageId
 * @param {string} questionId
 * @param { string | undefined } anchor
 */
function redirectWithAnchor(h, slug, pageId, questionId, anchor) {
  return h
    .redirect(
      editorv2Path(
        slug,
        `page/${pageId}/question/${questionId}/details${anchor}`
      )
    )
    .code(StatusCodes.SEE_OTHER)
}

const listQuestions = /** @type {string[]} */ ([
  ComponentType.AutocompleteField
])

/**
 * @param {string} formId
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {FormEditorInputQuestionDetails} payload
 * @returns {Promise<undefined|string>}
 */
async function saveList(formId, definition, token, payload) {
  if (!listQuestions.includes(`${payload.questionType}`)) {
    return undefined
  }

  const { list } = await upsertList(
    formId,
    definition,
    token,
    buildAutoCompleteListFromPayload(payload)
  )

  return list.name
}

/**
 * @param {string} formId
 * @param {string} pageId
 * @param {string} token
 * @param {FormDefinition} definition
 * @param {Partial<ComponentDef>} questionDetails
 * @param {string} questionId
 * @returns {Promise<string>}
 */
async function saveQuestion(
  formId,
  pageId,
  token,
  definition,
  questionDetails,
  questionId
) {
  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      questionDetails
    )
    return newPage.id ?? 'unknown'
  } else if (questionId === 'new') {
    await addQuestion(formId, token, pageId, questionDetails)
  } else {
    await updateQuestion(
      formId,
      token,
      definition,
      pageId,
      questionId,
      questionDetails
    )
  }
  return pageId
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
      const { params, auth, query } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string }} */ (
          params
        )

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const questionType = getQuestionType(yar, validation?.formValues)

      const enhancedActionState = getEnhancedActionStateFromSession(yar)

      // Intercept operations if say a radio or checkbox
      const redirectAnchor = handleEnhancedActionOnGet(yar, query)
      if (redirectAnchor) {
        return redirectWithAnchor(h, slug, pageId, questionId, redirectAnchor)
      }

      return h.view(
        'forms/editor-v2/question-details',
        viewModel.questionDetailsViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          questionType,
          validation,
          enhancedActionState
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
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string }} */ (
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
        payload,
        questionDetails
      )
      if (redirectAnchor) {
        return redirectWithAnchor(h, slug, pageId, questionId, redirectAnchor)
      }

      // Save page and first question
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const formId = metadata.id

      // TODO: When forms runner is updated move to id
      const listName = await saveList(formId, definition, token, payload)

      const questionDetailsWithList = listName
        ? { ...questionDetails, list: listName }
        : questionDetails

      const finalPageId = await saveQuestion(
        formId,
        pageId,
        token,
        definition,
        questionDetailsWithList,
        questionId
      )

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
 * @import { FormEditorInputQuestionDetails, ComponentDef, FormDefinition } from '@defra/forms-model'
 * @import { ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
