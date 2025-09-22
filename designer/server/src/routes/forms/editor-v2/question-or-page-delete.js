import { FormDefinitionError, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  buildConditionDependencyErrorView,
  getConditionDependencyContext,
  performPageDeletion,
  performQuestionDeletion,
  shouldDeleteQuestionOnly
} from '~/src/lib/deletion-helpers.js'
import { isInvalidFormErrorType } from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-delete.js'
import { editorv2Path } from '~/src/models/links.js'

const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId}/delete/{questionId?}`
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

/**
 * Builds error response for condition dependency blocking deletion
 * @param {any} h
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string | undefined} questionId
 * @param {DependencyContext} dependencyContext
 */
function buildConditionErrorResponse(
  h,
  metadata,
  definition,
  pageId,
  questionId,
  dependencyContext
) {
  const { message } = buildConditionDependencyErrorView(dependencyContext)

  return h.view(CONFIRMATION_PAGE_VIEW, {
    ...viewModel.deleteQuestionConfirmationPageViewModel(
      metadata,
      definition,
      pageId,
      questionId
    ),
    errorList: buildSimpleErrorList([message])
  })
}

/**
 * Handles race condition where conditions were added after initial check
 * @param {any} h
 * @param {string} formId
 * @param {string} token
 * @param {FormMetadata} metadata
 * @param {string} pageId
 * @param {string | undefined} questionId
 */
async function handleConditionRaceCondition(
  h,
  formId,
  token,
  metadata,
  pageId,
  questionId
) {
  const latestDefinition = await forms.getDraftFormDefinition(formId, token)
  const latestContext = getConditionDependencyContext(
    latestDefinition,
    pageId,
    questionId
  )

  return buildConditionErrorResponse(
    h,
    metadata,
    latestDefinition,
    pageId,
    questionId,
    latestContext
  )
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.deleteQuestionConfirmationPageViewModel(
          metadata,
          definition,
          pageId,
          questionId
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId?: string }}>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } = params
      const metadata = await forms.get(slug, token)

      const formId = metadata.id
      const definition = await forms.getDraftFormDefinition(formId, token)

      const dependencyContext = getConditionDependencyContext(
        definition,
        pageId,
        questionId
      )

      if (dependencyContext.blockingConditions.length) {
        return buildConditionErrorResponse(
          h,
          metadata,
          definition,
          pageId,
          questionId,
          dependencyContext
        )
      }

      try {
        const isQuestionDeletion = shouldDeleteQuestionOnly(
          definition,
          pageId,
          questionId
        )

        if (isQuestionDeletion && questionId) {
          await performQuestionDeletion(
            formId,
            token,
            pageId,
            questionId,
            definition
          )
        } else {
          await performPageDeletion(formId, token, pageId, definition)
        }
      } catch (err) {
        if (
          isInvalidFormErrorType(
            err,
            FormDefinitionError.RefConditionComponentId
          )
        ) {
          return handleConditionRaceCondition(
            h,
            formId,
            token,
            metadata,
            pageId,
            questionId
          )
        }

        throw err
      }

      // Redirect POST to GET
      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
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
  })
]

/**
 * @import { FormDefinition, FormMetadata } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { DependencyContext } from '~/src/lib/deletion-helpers.js'
 */
