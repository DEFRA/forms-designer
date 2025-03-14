import {
  ComponentType,
  guidanceTextSchema,
  hasComponents,
  pageHeadingSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { addPageAndFirstQuestion, updateQuestion } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/guidance.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_GUIDANCE = `/library/{slug}/editor-v2/page/{pageId}/guidance/{questionId}`

const errorKey = sessionNames.validationFailure.editorGuidance
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  pageHeading: pageHeadingSchema.required().messages({
    '*': 'Enter a page heading'
  }),
  guidanceText: guidanceTextSchema.required().messages({
    '*': 'Enter guidance text'
  })
})

/**
 *
 * @param {FormEditorInputGuidancePage} payload
 */
function mapGuidanceDetails(payload) {
  return /** @type {Partial<ComponentDef>} */ ({
    type: ComponentType.Markdown,
    content: payload.guidanceText,
    options: {},
    schema: {}
  })
}

/**
 * @param {string} formId
 * @param {*} token
 * @param {*} pageId
 * @param {*} questionId
 * @param {*} payload
 */
export async function addOrUpdateGuidance(
  formId,
  token,
  pageId,
  questionId,
  payload
) {
  const guidanceDetails = {
    ...mapGuidanceDetails(payload),
    id: questionId !== 'new' ? questionId : undefined
  }

  let finalPageId = pageId
  let finalQuestionId = questionId
  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      guidanceDetails,
      { title: payload.pageHeading }
    )
    finalPageId = newPage.id ?? 'unknown'
    finalQuestionId =
      (hasComponents(newPage) ? newPage.components[0].id : questionId) ??
      'unknown'
  } else {
    await updateQuestion(formId, token, pageId, questionId, guidanceDetails)
  }
  return { finalPageId, finalQuestionId }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_GUIDANCE,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string }} */ (
          params
        )

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/guidance',
        viewModel.guidanceViewModel(
          metadata,
          definition,
          pageId,
          questionId,
          validation,
          notification
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
   * @satisfies {ServerRoute<{ Payload: FormEditorInputGuidancePage }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_GUIDANCE,
    async handler(request, h) {
      const { params, payload, yar, auth } = request
      const { slug, pageId, questionId } =
        /** @type {{ slug: string, pageId: string, questionId: string}} */ (
          params
        )
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)

      const { finalPageId, finalQuestionId } = await addOrUpdateGuidance(
        metadata.id,
        token,
        pageId,
        questionId,
        payload
      )

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      // Redirect to next page
      return h
        .redirect(
          editorv2Path(slug, `page/${finalPageId}/guidance/${finalQuestionId}`)
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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { ComponentDef, FormEditorInputPage, FormEditorInputGuidancePage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
