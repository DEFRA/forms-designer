import { Scopes } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/advanced-settings.js'

export const ROUTE_FULL_PATH_ADVANCED_SETTINGS =
  '/library/{slug}/editor-v2/advanced-settings'

const notificationKey = sessionNames.successNotification

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_ADVANCED_SETTINGS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // Banner set by a settings page that changed a setting
      const notification = /** @type {string | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/advanced-settings',
        viewModel.advancedSettingsViewModel(metadata, definition, notification)
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
