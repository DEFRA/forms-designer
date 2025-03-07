import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages-reorder.js'

export const ROUTE_FULL_PATH_PAGES = '/library/{slug}/editor-v2/pages-reorder'

const notificationKey = sessionNames.successNotification
const reorderPagesKey = sessionNames.reorderPages

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGES,
    async handler(request, h) {
      const { params, auth, yar, query } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      // Page reorder
      const pageOrder = /** @type {string[] | undefined} */ (
        yar.flash(reorderPagesKey).at(0) ??
          (query.reorder !== undefined ? [] : undefined)
      )
      return h.view(
        'forms/editor-v2/pages-reorder',
        viewModel.pagesReorderViewModel(
          metadata,
          definition,
          notification,
          pageOrder
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
