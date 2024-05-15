import Boom from '@hapi/boom'

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
      const model = await library.listViewModel()
      return h.view('forms/library', model)
    },
    options: {
      auth: {
        mode: 'required'
      }
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
        const { params } = request

        // Retrieve form by slug
        const form = await forms.get(params.slug)
        if (!form) {
          return Boom.notFound(`Form with slug '${params.slug}' not found`)
        }

        const model = library.overviewViewModel(form)
        return h.view('forms/overview', model)
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
        const { params } = request

        // Retrieve form by slug
        const form = await forms.get(params.slug)
        if (!form) {
          return Boom.notFound(`Form with slug '${params.slug}' not found`)
        }

        const model = library.editorViewModel(form)
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
