import Boom from '@hapi/boom'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as makeLive from '~/src/models/forms/make-live.js'

const logger = createLogger()

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
        makeLive.confirmationPageViewModel(form.title, form.slug)
      )
    }
  }),
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/make-form-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials

      const form = await forms.get(request.params.slug, token)

      const formLiveResponse = await forms.makeDraftFormLive(
        form.id,
        request.auth.credentials.token
      )

      if (formLiveResponse.statusCode !== 200) {
        logger.error(`Failed to make form '${form.slug}' live`)
        throw Boom.internal()
      }

      yar.flash('formMakeLiveSuccess', true)
      return h.redirect(`/library/${form.slug}`)
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
