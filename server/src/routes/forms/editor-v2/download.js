import { Scopes } from '@defra/forms-model'

import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import * as forms from '~/src/lib/forms.js'
import { publishFormDownloadedEvent } from '~/src/messaging/publish.js'

export const ROUTE_PATH_DOWNLOAD = 'download'
export const ROUTE_FULL_PATH_DOWNLOAD = '/library/{slug}/editor-v2/download'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_DOWNLOAD,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id
      const definition = await forms.getDraftFormDefinition(formId, token)

      const filename = `${slug}.json`
      const definitionJson = JSON.stringify(definition, null, 2)

      const auditUser = mapUserForAudit(auth.credentials.user)
      await publishFormDownloadedEvent(formId, slug, auditUser)

      return h
        .response(definitionJson)
        .header('Content-Type', 'application/json')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
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
