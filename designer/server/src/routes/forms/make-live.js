import * as forms from '~/src/lib/forms.js'
import * as makeLive from '~/src/models/forms/make-live.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/make-form-live',
    async handler(request, h) {
      const { token } = request.auth.credentials
      const form = await forms.get(request.params.slug, token)

      return h.view(
        'forms/make-live',
        makeLive.confirmationPageViewModel(form.slug)
      )
    }
  })
]

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */

/**
 * @typedef {import('@hapi/hapi').ResponseToolkit<any>} ResponseToolkit
 * @typedef {Request<{ Payload: any }>} RequestWithPayload
 */
