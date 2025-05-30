import { ComponentType, questionDetailsFullSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  addPageAndFirstQuestion,
  addQuestion,
  updateQuestion
} from '~/src/lib/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import {
  dispatchToPageTitle,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import { buildListFromDetails, upsertList } from '~/src/lib/list.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createQuestionSessionState,
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { isListComponentType, requiresPageTitle } from '~/src/lib/utils.js'
import {
  allSpecificSchemas,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { baseSchema } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import { getFormPage } from '~/src/routes/forms/editor-v2/helpers.js'
import {
  enforceFileUploadFieldExclusivity,
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost
} from '~/src/routes/forms/editor-v2/question-details-helper.js'

/**
 * `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details/{stateId?}`
 * @type {string}
 */
export const ROUTE_FULL_PATH_QUESTION_DETAILS = `/library/{slug}/editor-v2/page/{pageId}/question/{questionId}/details/{stateId?}`

const errorKey = sessionNames.validationFailure.editorQuestionDetails

const schema = baseSchema.concat(allSpecificSchemas)

const preSchema = Joi.object()
  .keys({
    'list-items': questionDetailsFullSchema.listItemCountSchema.when(
      'questionType',
      {
        is: Joi.string().valid('CheckboxesField', 'RadiosField'),
        then: Joi.when('enhancedAction', {
          is: Joi.exist(),
          then: Joi.number().optional(),
          otherwise: Joi.number().min(2).messages({
            '*': 'At least 2 items are required for a list'
          })
        }),
        otherwise: Joi.number().optional()
      }
    )
  })
  .unknown(true)

/**
 * @param {ResponseToolkit<{ Params: { slug: string, pageId: string, questionId: string, stateId?: string } }> | ResponseToolkit< { Payload: FormEditorInputQuestionDetails }>} h
 * @param {string} slug
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param { string | undefined } anchorOrUrl - anchor (starting with '#') or a relative url
 */
function redirectWithAnchorOrUrl(
  h,
  slug,
  pageId,
  questionId,
  stateId,
  anchorOrUrl
) {
  return h
    .redirect(
      editorv2Path(
        slug,
        `page/${pageId}/question/${questionId}/details/${stateId}${anchorOrUrl}`
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
export async function saveList(
  formId,
  definition,
  token,
  questionDetails,
  listItems
) {
  if (!isListComponentType(questionDetails.type ?? ComponentType.TextField)) {
    return undefined
  }

  const listMapped = buildListFromDetails(
    questionDetails,
    listItems ?? [],
    definition
  )

  const { list, status } = await upsertList(
    formId,
    definition,
    token,
    listMapped
  )

  return status === 'created' ? list.id : undefined
}

/**
 * @param {FormEditorInputQuestionDetails} payload
 * @param { QuestionSessionState | undefined } state
 */
export function getListItems(payload, state) {
  if (payload.listItemsData) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return /** @type {Item[]} */ (JSON.parse(payload.listItemsData))
  }
  return /** @type {Item[]} */ (
    payload.questionType === ComponentType.AutocompleteField
      ? payload.autoCompleteOptions
      : state?.listItems
  )
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails } >} request
 * @param {ResponseToolkit<{ Payload: FormEditorInputQuestionDetails } >} h
 */
export function validatePreSchema(request, h) {
  const { params, payload, yar } = request
  const { stateId } = /** @type {{ stateId: string }} */ (params)

  const state = getQuestionSessionState(yar, stateId)

  const jsEnabled = payload.jsEnabled === 'true'
  const listItems = jsEnabled
    ? /** @type {ListItem[]} */ (JSON.parse(payload.listItemsData))
    : state?.listItems

  const { error } = preSchema.validate({
    ...payload,
    'list-items': listItems?.length ?? 0
  })

  if (error) {
    overrideStateIfJsEnabled(request)
    return redirectWithErrors(
      /** @type {Request} */ request,
      h,
      error,
      errorKey,
      '#'
    )
  }

  return request
}

/**
 * @param { Request | Request<{ Payload: FormEditorInputQuestionDetails } > } request
 */
export function overrideStateIfJsEnabled(request) {
  const { payload, params } = request
  if (typeof payload === 'object') {
    const jsEnabled = 'jsEnabled' in payload && payload.jsEnabled === 'true'
    const questionType =
      'questionType' in payload
        ? /** @type {string} */ (payload.questionType)
        : undefined
    const listItemsData =
      'listItemsData' in payload
        ? /** @type {string} */ (payload.listItemsData)
        : undefined
    const stateId =
      'stateId' in params ? /** @type {string} */ (params.stateId) : 'unknown'

    if (jsEnabled) {
      const overridenState = /** @type {QuestionSessionState} */ ({
        questionType,
        editRow: {
          expanded: false
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        listItems:
          /** @type { { text?: string, hint?: { id?: string; text: string }, value?: string, id?: string }[]} */
          (JSON.parse(listItemsData ?? '[]'))
      })
      setQuestionSessionState(request.yar, stateId, overridenState)
    }
  }
  return undefined
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
  const listId = await saveList(
    formId,
    definition,
    token,
    questionDetails,
    listItems
  )

  const questDetailsWithList = listId
    ? { ...questionDetails, list: listId }
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
      const { yar, params, auth, query } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId, stateId } = params

      const currentTab = /** @type {string} */ (query.tab) ?? 'question'

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
        return redirectWithAnchorOrUrl(
          h,
          slug,
          pageId,
          questionId,
          newStateId,
          ''
        )
      }

      const validation =
        /** @type {ValidationFailure<FormEditor> | undefined} */ (
          getValidationErrorsFromSession(yar, errorKey)
        )

      // Also check for conditions validation errors
      const conditionsValidation =
        /** @type {ValidationFailure<any> | undefined} */ (
          getValidationErrorsFromSession(
            yar,
            sessionNames.validationFailure.editorPageConditions
          )
        )

      const state = buildQuestionSessionState(
        yar,
        stateId,
        definition,
        pageId,
        questionId
      )

      // Intercept operations if say a radio or checkbox
      const redirectAnchorOrUrl = handleEnhancedActionOnGet(yar, stateId, query)
      if (redirectAnchorOrUrl) {
        return redirectWithAnchorOrUrl(
          h,
          slug,
          pageId,
          questionId,
          stateId,
          redirectAnchorOrUrl
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
          { state, currentTab, conditionsValidation }
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

      const fileUploadLimitsPayload = enforceFileUploadFieldExclusivity(
        /** @type {FormEditorInputQuestion} */ (payload)
      )

      const questionDetails = {
        ...mapQuestionDetails(fileUploadLimitsPayload),
        id: questionId !== 'new' ? questionId : undefined
      }

      // Intercept operations if say a radio or checkbox
      const redirectAnchorOrUrl = handleEnhancedActionOnPost(
        request,
        stateId,
        questionDetails
      )
      if (redirectAnchorOrUrl) {
        return redirectWithAnchorOrUrl(
          h,
          slug,
          pageId,
          questionId,
          stateId,
          redirectAnchorOrUrl
        )
      }

      // Save page and first question
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

      const state = getQuestionSessionState(yar, stateId)

      try {
        const finalPageId = await saveQuestion(
          metadata.id,
          token,
          definition,
          pageId,
          questionId,
          questionDetails,
          getListItems(fileUploadLimitsPayload, state)
        )

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        clearQuestionSessionState(yar, stateId)

        // Redirect to next page
        return h
          .redirect(editorv2Path(slug, `page/${finalPageId}/questions`))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey, '#')
        }
        throw err
      }
    },
    options: {
      pre: [validatePreSchema],
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          overrideStateIfJsEnabled(request)
          return redirectWithErrors(request, h, error, errorKey, '#')
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
 * @import { ComponentDef, FormDefinition, FormEditorInputQuestionDetails, Item, ListItem, QuestionSessionState, FormEditorInputQuestion, FormEditor } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
