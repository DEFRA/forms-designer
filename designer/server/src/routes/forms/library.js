import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as library from '~/src/models/forms/library.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library',
    async handler(request, h) {
      const { auth } = request
      const token = auth.credentials.token
      const model = await library.listViewModel(token)

      return h.view('forms/library', model)
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'get',
    path: '/library/{slug}',
    options: {
      async handler(request, h) {
        const { auth, params, yar } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        const titleActionItems = []
        if (!form.live) {
          titleActionItems.push({
            href: `/library/${form.slug}/edit/title`,
            text: 'Change',
            visuallyHiddenText: 'title'
          })
        }

        const model = library.overviewViewModel(
          form,
          yar.flash(sessionNames.successNotification).at(0)
        )

        return h.view('forms/overview', { ...model, titleActionItems })
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'get',
    path: '/library/{slug}/editor',
    options: {
      async handler(request, h) {
        const { auth, params } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        // Retrieve definition by ID
        const definition = await forms.getDraftFormDefinition(form.id, token)

        const model = library.editorViewModel(form, definition)
        return h.view('forms/editor', model)
      }
    }
  })
]

/**
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
