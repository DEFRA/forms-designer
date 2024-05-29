import Boom from '@hapi/boom'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as formLifecycle from '~/src/models/forms/form-lifecycle.js'

const logger = createLogger()

export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/make-draft-live',
    async handler(request, h) {
      const { token } = request.auth.credentials
      const form = await forms.get(request.params.slug, token)

      return h.view(
        'forms/make-draft-live',
        formLifecycle.confirmationPageViewModel(form)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/make-draft-live',
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

      yar.flash(sessionNames.displayCreateLiveSuccess, true)
      return h.redirect(`/library/${form.slug}`)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/create-draft-from-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const { slug } = request.params

      const form = await forms.get(slug, token)
      const formDraftResponse = await forms.createDraft(form.id, token)

      if (formDraftResponse.statusCode !== 200) {
        logger.error(`Failed to create a draft form for form ID ${form.id}`)
        throw Boom.internal()
      }

      yar.flash(sessionNames.displayCreateDraftSuccess, true)
      return h.redirect(`/library/${slug}`)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @typedef {import('@defra/forms-model').FormBySlugInput} FormBySlugInput
 */

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