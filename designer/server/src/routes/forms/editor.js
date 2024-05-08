import Boom from '@hapi/boom'

import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { id: string } }>}
   */
  ({
    method: 'get',
    path: '/editor/{id*}',
    options: {
      async handler(request, h) {
        const { params } = request

        /** @type {FormMetadata | undefined} */
        let form

        // Retrieve form by slug
        try {
          form = await forms.get(params.id)
        } catch (error) {
          return Boom.notFound(`Form with id '${params.id}' not found`)
        }

        return h.view('forms/editor', {
          phase: config.phase,
          previewUrl: config.previewUrl,
          form: {
            id: form.id,
            slug: form.slug
          }
        })
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
