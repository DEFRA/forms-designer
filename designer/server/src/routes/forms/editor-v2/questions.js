import {
  guidanceTextSchema,
  pageHeadingAndGuidanceSchema,
  pageHeadingSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { setPageHeadingAndGuidance } from '~/src/lib/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import {
  getValidationErrorsFromSession,
  pageTitleError
} from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getFormComponentsCount,
  getPageFromDefinition,
  isCheckboxSelected
} from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/questions.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_QUESTIONS = `/library/{slug}/editor-v2/page/{pageId}/questions`

export const ROUTE_PATH_QUESTION_DETAILS =
  '/library/{slug}/editor-v2/page/{pageId}/question/{questionId}'

const errorKey = sessionNames.validationFailure.editorQuestions

export const schema = Joi.object().keys({
  pageHeadingAndGuidance: pageHeadingAndGuidanceSchema,
  pageHeading: Joi.when('pageHeadingAndGuidance', {
    is: 'true',
    then: pageHeadingSchema.required().messages({
      '*': 'Enter a page heading'
    })
  }),
  guidanceText: guidanceTextSchema.optional().allow('')
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTIONS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view(
        'forms/editor-v2/questions',
        viewModel.questionsViewModel(
          metadata,
          definition,
          pageId,
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
   * @satisfies {ServerRoute<{ Payload: Partial<FormEditorInputPageSettings> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTIONS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )
      const { token } = auth.credentials

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const page = getPageFromDefinition(definition, pageId)

      if (!page) {
        throw Boom.notFound(`Page with id '${pageId}' not found`)
      }

      const isExpanded = isCheckboxSelected(payload.pageHeadingAndGuidance)

      try {
        // Ensure there's a page title when multiple questions exist
        if (
          (!isExpanded || !payload.pageHeading) &&
          getFormComponentsCount(page) > 1
        ) {
          return redirectWithErrors(
            request,
            h,
            pageTitleError(),
            sessionNames.validationFailure.editorQuestions
          )
        }

        await setPageHeadingAndGuidance(
          metadata.id,
          token,
          pageId,
          definition,
          payload
        )

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect to same page
        return h
          .redirect(editorv2Path(slug, `page/${pageId}/questions`))
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
 * @import { FormEditorInputPageSettings } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
