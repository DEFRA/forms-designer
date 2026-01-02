import { Scopes } from '@defra/forms-model'

import * as audit from '~/src/lib/audit.js'
import * as forms from '~/src/lib/forms.js'
import { historyViewModel } from '~/src/models/forms/history.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/history',
    options: {
      async handler(request, h) {
        const { auth, params } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        // Get form definition if draft exists
        let definition
        if (form.draft) {
          definition = await forms.getDraftFormDefinition(form.id, token)
        }

        // Fetch form history
        const auditResponse = await audit.getFormHistory(form.id, token)

        const model = historyViewModel(
          form,
          definition,
          auditResponse.auditRecords
        )

        return h.view('forms/history', model)
      },
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
