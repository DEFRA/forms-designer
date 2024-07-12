import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/edit.js'
import { schema } from '~/src/routes/forms/create.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/edit/lead-organisation',
    handler(request, h) {
      const { yar } = request
      const { slug } = request.params

      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-radios',
        edit.organisationViewModel(slug, validation)
      )
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: FormMetadataInput }>}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/edit/lead-organisation',
    async handler(request, h) {
      const { token } = request.auth.credentials
      const { organisation } = request.payload
      const { slug } = request.params

      const { id } = await forms.get(slug, token)
      // TODO await forms.updateMetadata(id, { organisation }, token)

      return h.redirect(`/library/${slug}`).code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),

        failAction(request, h, error) {
          const { payload, yar, url } = request
          const { pathname: redirectTo } = url

          if (error instanceof Joi.ValidationError) {
            yar.flash('validationFailure', {
              formErrors: buildErrorDetails(error),
              formValues: payload
            })
          }

          // Redirect POST to GET without resubmit on back button
          return h.redirect(redirectTo).code(303).takeover()
        }
      }
    }
  })
]

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
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
