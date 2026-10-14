import { Scopes, disableUserFeedbackSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { setFormOption } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/user-feedback-settings.js'
import { editorv2Path } from '~/src/models/links.js'
import { postAuthSettings } from '~/src/routes/forms/editor-v2/check-answers-settings/declaration-settings.js'

export const ROUTE_FULL_PATH_USER_FEEDBACK_SETTINGS = `/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/user-feedback`

const errorKey = sessionNames.validationFailure.editorUserFeedbackSettings
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  disableUserFeedback: disableUserFeedbackSchema
})

const USER_FEEDBACK_OPTION_KEY = 'disableUserFeedback'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_USER_FEEDBACK_SETTINGS,
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
        'forms/editor-v2/check-answers-settings/user-feedback-settings',
        viewModel.userFeedbackSettingsViewModel(
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
   * @satisfies {ServerRoute<{ Payload: FormEditorInputUserFeedbackSettings }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_USER_FEEDBACK_SETTINGS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug } = /** @type {{ slug: string, pageId: string }} */ (params)
      const { token } = auth.credentials

      // Form metadata and page components
      const metadata = await forms.get(slug, token)

      await setFormOption(
        metadata.id,
        token,
        USER_FEEDBACK_OPTION_KEY,
        payload.disableUserFeedback ? 'true' : 'false'
      )

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
 * @import { FormEditorInputUserFeedbackSettings } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
