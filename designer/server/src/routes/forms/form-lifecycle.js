import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import * as notifications from '~/src/common/constants/notifications.js'
import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import * as formLifecycle from '~/src/models/forms/form-lifecycle.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/make-draft-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const form = await forms.get(request.params.slug, token)

      const formPromotionValidationFailure = yar.flash(sessionNames.errorList)

      return h.view(
        'forms/make-draft-live',
        formLifecycle.confirmationPageViewModel(
          form,
          formPromotionValidationFailure
        )
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
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/make-draft-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials

      const form = await forms.get(request.params.slug, token)

      try {
        await forms.makeDraftFormLive(form.id, token)

        yar.flash(
          sessionNames.successNotification,
          notifications.FORM_LIVE_CREATED
        )

        return h.redirect(`/library/${form.slug}`)
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.BAD_REQUEST.valueOf()
        ) {
          yar.flash(sessionNames.errorList, buildSimpleErrorList([err.message]))

          return h.redirect(`/library/${form.slug}/make-draft-live`)
        }

        throw err
      }
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
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/create-draft-from-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const { slug } = request.params

      const form = await forms.get(slug, token)
      await forms.createDraft(form.id, token)

      yar.flash(
        sessionNames.successNotification,
        notifications.FORM_DRAFT_CREATED
      )

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
