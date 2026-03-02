import {
  ComponentType,
  Scopes,
  questionDetailsFullSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  checkBoomError,
  createJoiError,
  handleInvalidFormErrors
} from '~/src/lib/error-boom-helper.js'
import {
  dispatchToPageTitle,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { savePaymentSecrets } from '~/src/lib/secrets.js'
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createQuestionSessionState,
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { requiresPageTitle } from '~/src/lib/utils.js'
import {
  allSpecificSchemas,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { baseSchema } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import { cannotResolveAllItems } from '~/src/models/forms/editor-v2/edit-list-resolve.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import { getFormPage } from '~/src/routes/forms/editor-v2/helpers.js'
import {
  handleListConflict,
  saveQuestion
} from '~/src/routes/forms/editor-v2/question-details-helper-ext.js'
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
        is: Joi.string().valid('CheckboxesField', 'RadiosField', 'SelectField'),
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
 * @param {FormEditorInputQuestionDetails} payload
 * @param { QuestionSessionState | undefined } state
 */
export function getListItems(payload, state) {
  if (payload.listItemsData) {
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
  const listItems =
    jsEnabled && payload.listItemsData
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
 * @param {string} questionId
 * @param { ComponentType | undefined } questionType
 */
export function isExistingAutocomplete(questionId, questionType) {
  return (
    questionId !== 'new' && questionType === ComponentType.AutocompleteField
  )
}

/**
 * @param {string} questionId
 * @param { Page | undefined } page
 */
export function missingPageTitleForMultipleQuestions(questionId, page) {
  return questionId === 'new' && requiresPageTitle(page)
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
 * @param { Request | Request<any> } request
 * @param {ResponseToolkit<any>} h - the response toolkit
 * @param {string} stateId
 */
export function chooseResolutionRoute(request, h, stateId) {
  const state = getQuestionSessionState(request.yar, stateId) ?? {}
  const notResolvable = cannotResolveAllItems(state.listConflicts)
  if (notResolvable) {
    const joiErr = createJoiError(
      'autoCompleteOptions',
      'Add a new option to replace the one you deleted, or delete the condition that uses it.'
    )

    return redirectWithErrors(request, h, joiErr, errorKey, '#')
  }

  const { pathname } = request.url
  return h.redirect(`${pathname}/resolve`).code(StatusCodes.SEE_OTHER)
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

      const validation = getValidationErrorsFromSession(yar, errorKey)

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
        await viewModel.questionDetailsViewModel(
          {
            metadata,
            definition,
            pageId,
            questionId
          },
          stateId,
          token,
          query,
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
          scope: [`+${Scopes.FormRead}`]
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
      if (missingPageTitleForMultipleQuestions(questionId, page)) {
        return dispatchToPageTitle(
          request,
          h,
          editorv2Path(slug, `page/${pageId}/questions`)
        )
      }

      const state = getQuestionSessionState(yar, stateId) ?? {}

      if (isExistingAutocomplete(questionId, questionDetails.type)) {
        state.questionDetails = questionDetails

        const redirectForConflict = handleListConflict(
          definition,
          pageId,
          questionId,
          payload.autoCompleteOptions,
          yar,
          state,
          stateId
        )
        if (redirectForConflict) {
          return chooseResolutionRoute(request, h, stateId)
        }
      }

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

        await savePaymentSecrets(
          questionDetails.type,
          metadata.id,
          payload,
          token
        )

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        clearQuestionSessionState(yar, stateId)

        // Redirect to next page
        return h
          .redirect(editorv2Path(slug, `page/${finalPageId}/questions`))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const joiErr = handleInvalidFormErrors(err, definition)
        if (joiErr) {
          return redirectWithErrors(request, h, joiErr, errorKey, '#')
        }

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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { FormEditorInputQuestionDetails, Item, ListItem, Page, QuestionSessionState, FormEditorInputQuestion } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
