import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/migrate.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_MIGRATE = '/library/{slug}/editor-v2/migrate'
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_MIGRATE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.migrateConfirmationPageViewModel(metadata)
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
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_MIGRATE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      await editor.migrateDefinitionToV2(formId, token)

      // Redirect POST to GET without resubmit on back button
      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
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
