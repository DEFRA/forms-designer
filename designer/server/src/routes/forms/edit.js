import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/edit.js'
import { schema, displayJoiFailures } from '~/src/routes/forms/create.js'

export const ROUTE_PATH_EDIT_LEAD_ORGANISATION =
  '/library/{slug}/edit/lead-organisation'

/**
 * Get the notification message for when a field is changed
 * @param {string} fieldName
 */
function getNotificationMessage(fieldName) {
  return `${fieldName} has been changed`
}

export default [
  /**
   * @satisfies {RequestBySlug}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_LEAD_ORGANISATION,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-radios',
        edit.organisationViewModel(slug, metadata, validation)
      )
    }
  }),
  /**
   * @satisfies {RequestUpdateMetadataBySlug}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_LEAD_ORGANISATION,
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

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
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
 * @typedef {ServerRoute<{ Params: { slug: string } }>} RequestBySlug
 * @typedef {ServerRoute<{ Params: { slug: string }, Payload: FormMetadataInput }>} RequestUpdateMetadataBySlug
 */
