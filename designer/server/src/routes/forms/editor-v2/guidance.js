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
import { addPageAndFirstQuestion, setPageSettings } from '~/src/lib/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
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
 * @param {string} token
 * @param {string} pageId
 * @param {string} questionId
 * @param {FormDefinition} definition
 * @param {FormEditorInputGuidancePage} payload
 */
export async function addOrUpdateGuidance(
  formId,
  token,
  pageId,
  questionId,
  definition,
  payload
) {
  const guidanceDetails = {
    ...mapGuidanceDetails(payload),
    id: questionId !== 'new' ? questionId : undefined
  }

  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      guidanceDetails,
      { title: payload.pageHeading }
    )
    const newComponentId = hasComponents(newPage)
      ? newPage.components[0].id
      : questionId
    return {
      finalPageId: newPage.id ?? 'unknown',
      finalQuestionId: newComponentId ?? 'unknown'
    }
  } else {
    await setPageSettings(formId, token, pageId, definition, {
      ...payload,
      pageHeadingAndGuidance: 'true'
    })
  }
  return {
    finalPageId: pageId,
    finalQuestionId: questionId
  }
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

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      try {
        const { finalPageId, finalQuestionId } = await addOrUpdateGuidance(
          metadata.id,
          token,
          pageId,
          questionId,
          definition,
          payload
        )

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect to next page
        return h
          .redirect(
            editorv2Path(
              slug,
              `page/${finalPageId}/guidance/${finalQuestionId}`
            )
          )
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey)
        }
        throw err
      }
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
 * @import { ComponentDef, FormDefinition, FormEditorInputGuidancePage } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { ServerRoute } from '@hapi/hapi'
 */
