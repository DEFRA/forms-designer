import { Scopes } from '@defra/forms-model'

import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/check-answers-overview.js'

export const ROUTE_FULL_PATH_CHECK_ANSWERS_OVERVIEW = `/library/{slug}/editor-v2/page/{pageId}/check-answers-overview`

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CHECK_ANSWERS_OVERVIEW,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId } = params

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        'forms/editor-v2/check-answers-overview',
        viewModel.checkAnswersOverviewViewModel(metadata, definition, pageId)
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
