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
import { buildListFromDetails, upsertList } from '~/src/lib/list.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createQuestionSessionState,
  getQuestionSessionState
} from '~/src/lib/session-helper.js'
import { isListComponent } from '~/src/lib/utils.js'
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
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param {Item[] | undefined } listItems
 * @returns {Promise<undefined|string>}
 */
async function saveList(formId, definition, token, questionDetails, listItems) {
  if (!isListComponent(questionDetails.type ?? ComponentType.TextField)) {
    return undefined
  }

  const listMapped = buildListFromDetails(questionDetails, listItems ?? [])

  const { list, status } = await upsertList(
    formId,
    definition,
    token,
    listMapped
  )

  return status === 'created' ? list.name : undefined
}

/**
 * @param {FormEditorInputQuestionDetails} payload
 * @param { QuestionSessionState | undefined } state
 */
export function getListItems(payload, state) {
  return /** @type {Item[]} */ (
    payload.questionType === ComponentType.AutocompleteField
      ? payload.autoCompleteOptions
      : state?.listItems
  )
}

/**
 * @param {string} formId
 * @param {string} token
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {Partial<ComponentDef>} questionDetails
 * @param { Item[] | undefined } listItems
 * @returns {Promise<string>}
 */
async function saveQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails,
  listItems
) {
  // Create or update the list (if this is a Component that uses a List)
  const listName = await saveList(
    formId,
    definition,
    token,
    questionDetails,
    listItems
  )

  const questDetailsWithList = listName
    ? { ...questionDetails, list: listName }
    : questionDetails

  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      questDetailsWithList
    )
    return newPage.id ?? 'unknown'
  } else if (questionId === 'new') {
    await addQuestion(formId, token, pageId, questDetailsWithList)
  } else {
    await updateQuestion(
      formId,
      token,
      definition,
      pageId,
      questionId,
      questDetailsWithList
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

      // Set up session if not yet exists
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
          stateId,
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
        getListItems(payload, state)
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
 * @import { ComponentDef, FormDefinition, FormEditorInputQuestionDetails, Item, QuestionSessionState } from '@defra/forms-model'
 * @import { ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
