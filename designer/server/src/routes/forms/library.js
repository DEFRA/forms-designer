import * as scopes from '~/src/common/constants/scopes.js'
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
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_READ}`]
        }
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
        const { auth, params, yar } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)
        const model = library.overviewViewModel(
          form,
          getFlashFlag(yar, 'displayCreateLiveSuccess'),
          getFlashFlag(yar, 'displayCreateDraftSuccess')
        )

        return h.view('forms/overview', model)
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_READ}`]
        }
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
        const model = library.editorViewModel(form)

        return h.view('forms/editor', model)
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_READ}`]
        }
      }
    }
  })
]

/**
 * Get a success flag from yar, defaulting to false.
 * @param {import('@hapi/yar').Yar} yar
 * @param {string} key
 * @returns {boolean}
 */
function getFlashFlag(yar, key) {
  return /** @type {boolean} */ (yar.flash(key).at(0)) ?? false
}

/**
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
