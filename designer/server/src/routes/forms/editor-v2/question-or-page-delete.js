import { FormDefinitionError, Scopes, isFormType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import { deletePage, deleteQuestion } from '~/src/lib/editor.js'
import { isInvalidFormErrorType } from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { getComponentsOnPageFromDefinition } from '~/src/lib/utils.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-delete.js'
import { editorv2Path } from '~/src/models/links.js'

const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId}/delete/{questionId?}`
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

/**
 * @param {string} pageId
 * @param {FormDefinition} definition
 * @returns {boolean}
 */
export function shouldDeleteQuestionOnly(pageId, definition) {
  // If only one (non-guidance question) on the page, 'deleting the question' becomes 'deleting the page'

  const components = getComponentsOnPageFromDefinition(definition, pageId)
  const formComponents = components.filter((c) => isFormType(c.type))
  return formComponents.length > 1
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const badRequestErrorList = yar.id
        ? yar.flash(sessionNames.badRequestErrorList)
        : []

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.deleteQuestionConfirmationPageViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          badRequestErrorList
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

      try {
        // If only one (non-guidance question) on the page, 'deleting the question' becomes 'deleting the page'
        if (questionId && shouldDeleteQuestionOnly(pageId, definition)) {
          await deleteQuestion(formId, token, pageId, questionId, definition)
        } else {
          await deletePage(formId, token, pageId, definition)
        }

        // Redirect POST to GET
        return h
          .redirect(editorv2Path(slug, 'pages'))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        if (
          isInvalidFormErrorType(
            err,
            FormDefinitionError.RefConditionComponentId
          )
        ) {
          const errorList = buildSimpleErrorList([
            'A condition is using a question on this page. Remove the condition before re-attempting its removal.'
          ])

          return h.view(CONFIRMATION_PAGE_VIEW, {
            ...viewModel.deleteQuestionConfirmationPageViewModel(
              metadata,
              definition,
              pageId,
              questionId
            ),
            errorList
          })
        }

        // Re-throw other errors to be handled by the error-pages plugin
        throw err
      }
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
 * @import { FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
