import { Scopes, disableConfirmationEmailSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { setConfirmationEmailSettings } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/confirmation-email-settings.js'
import { editorv2Path } from '~/src/models/links.js'
import { postAuthSettings } from '~/src/routes/forms/editor-v2/check-answers-settings.js'

export const ROUTE_FULL_PATH_CONFIRMATION_EMAIL_SETTINGS = `/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/confirmation-email`

const errorKey = sessionNames.validationFailure.editorConfirmationEmailSettings
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  disableConfirmationEmail: disableConfirmationEmailSchema
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CONFIRMATION_EMAIL_SETTINGS,
    async handler(request, h) {
      const { params, auth, yar } = request
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
        'forms/editor-v2/confirmation-email-settings',
        viewModel.confirmationEmailSettingsViewModel(
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
   * @satisfies {ServerRoute<{ Payload: FormEditorInputConfirmationEmailSettings }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_CONFIRMATION_EMAIL_SETTINGS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )
      const { token } = auth.credentials

      // Form metadata and page components
      const metadata = await forms.get(slug, token)

      await setConfirmationEmailSettings(metadata.id, token, pageId, payload)

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      // Redirect to pages list - same as check-answers-settings page.
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
 * @import { FormEditorInputConfirmationEmailSettings } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
