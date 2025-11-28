import {
  Scopes,
  declarationTextSchema,
  needDeclarationSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { setCheckAnswersDeclaration } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/check-answers-settings.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_CHECK_ANSWERS_SETTINGS = `/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/declaration`

const errorKey = sessionNames.validationFailure.editorCheckAnswersSettings
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  needDeclaration: needDeclarationSchema,
  declarationText: Joi.when('needDeclaration', {
    is: 'true',
    then: declarationTextSchema.required().messages({
      '*': 'Enter the information you need users to declare or agree to'
    })
  })
})

/** @type {RouteOptions['auth']} */
export const postAuthSettings = {
  mode: 'required',
  access: {
    entity: 'user',
    scope: [`+${Scopes.FormEdit}`]
  }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CHECK_ANSWERS_SETTINGS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId } = params

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // Validation errors
      const validation = getValidationErrorsFromSession(yar, errorKey)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/check-answers-settings',
        viewModel.checkAnswersSettingsViewModel(
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
          scope: [`+${Scopes.FormRead}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Payload: Partial<FormEditorInputCheckAnswersSettings> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_CHECK_ANSWERS_SETTINGS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )
      const { token } = auth.credentials

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      await setCheckAnswersDeclaration(
        metadata.id,
        token,
        pageId,
        definition,
        payload
      )

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      // Redirect to pages list
      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: postAuthSettings
    }
  })
]

/**
 * @import { FormEditorInputCheckAnswersSettings } from '@defra/forms-model'
 * @import { RouteOptions, ServerRoute } from '@hapi/hapi'
 */
