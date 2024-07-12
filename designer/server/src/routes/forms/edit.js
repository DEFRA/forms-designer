import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/edit.js'
import { schema, displayJoiFailures } from '~/src/routes/forms/create.js'

/**
 * Get the notification message for when a field is changed
 * @param {string} fieldName
 */
function getNotificationMessage(fieldName) {
  return `${fieldName} has been changed`
}

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
      const { yar, auth, payload, params } = request
      const { token } = auth.credentials
      const { slug } = params
      const { organisation } = payload

      const { id } = await forms.get(slug, token)
      await forms.updateMetadata(id, { organisation }, token)

      yar.flash(
        sessionNames.successNotification,
        getNotificationMessage('Lead organisation')
      )

      return h.redirect(`/library/${slug}`).code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),
        failAction: displayJoiFailures
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
