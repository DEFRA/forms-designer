import * as scopes from '~/src/common/constants/scopes.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/editor-v2.js'

export const ROUTE_PATH_EDIT_FORM2 = '/library/{slug}/editor-v2'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_FORM2,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        'forms/editor-v2/pages',
        edit.pageListViewModel(metadata, definition)
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
