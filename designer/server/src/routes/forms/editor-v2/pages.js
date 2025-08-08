import { SchemaVersion, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages.js'
import { editorv2Path } from '~/src/models/links.js'

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

      const definition = await forms.getDraftFormDefinition(formId, token)

      if (definition.schema !== SchemaVersion.V2) {
        return h
          .redirect(editorv2Path(slug, 'migrate'))
          .code(StatusCodes.SEE_OTHER)
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
          scope: [`+${Scopes.FormRead}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
