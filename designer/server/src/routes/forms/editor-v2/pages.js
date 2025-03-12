import { Engine } from '@defra/forms-model'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages.js'

export const ROUTE_PATH_PAGES = 'pages'
export const ROUTE_FULL_PATH_PAGES = '/library/{slug}/editor-v2/pages'

const notificationKey = sessionNames.successNotification

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGES,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      let definition = await forms.getDraftFormDefinition(formId, token)

      if (definition.engine === Engine.V1) {
        definition = await editor.migrateDefinitionToV2(formId, token)
      }

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/pages',
        viewModel.pagesViewModel(metadata, definition, notification)
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
