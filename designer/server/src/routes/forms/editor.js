import Boom from '@hapi/boom'

import * as forms from '~/src/lib/forms.js'
import * as editor from '~/src/models/forms/editor.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'get',
    path: '/editor/{slug*}',
    options: {
      async handler(request, h) {
        const { params } = request

        // Retrieve form by slug
        const form = await forms.get(params.slug)
        if (!form) {
          return Boom.notFound(`Form with slug '${params.slug}' not found`)
        }

        const model = editor.editorViewModel(form)
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
