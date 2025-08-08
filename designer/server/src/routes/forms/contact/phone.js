import { Scopes, phoneSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import {
  allowDelete,
  phoneViewModel
} from '~/src/models/forms/contact/phone.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_PHONE_CONTACT =
  '/library/{slug}/edit/contact/phone'

export const phoneContactSchema = Joi.object().keys({
  phone: phoneSchema
    .required()
    .when('_delete', { is: true, then: Joi.allow('') })
    .messages({
      'string.empty':
        'Enter phone number and opening times for users to get help'
    }),
  _delete: Joi.boolean()
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_PHONE_CONTACT,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.contactPhone)
        .at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the phone contact view model
      const model = phoneViewModel(metadata, validation)

      return h.view('forms/contact/phone', model)
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataContact, 'phone'> & { _delete: boolean } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_PHONE_CONTACT,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { phone, _delete } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)
      const { id, contact = {} } = metadata

      if (!_delete || allowDelete(metadata)) {
        // Update the metadata with the phone contact details
        await forms.updateMetadata(
          id,
          { contact: { ...contact, phone: _delete ? undefined : phone } },
          token
        )

        yar.flash(
          sessionNames.successNotification,
          `Phone number for support has been ${_delete ? 'removed' : 'updated'}`
        )
      }

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: phoneContactSchema,
        /**
         * @param {Request} request
         * @param {ResponseToolkit} h
         * @param {Error} [error]
         */
        failAction: (request, h, error) => {
          const { payload, yar, url } = request
          const { pathname: redirectTo } = url

          if (error && error instanceof Joi.ValidationError) {
            const formErrors = buildErrorDetails(error)

            yar.flash(sessionNames.validationFailure.contactPhone, {
              formErrors,
              formValues: payload
            })
          }

          // Redirect POST to GET without resubmit on back button
          return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      },
      pre: [protectMetadataEditOfLiveForm]
    }
  })
]

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { FormMetadataContact } from '@defra/forms-model'
 */
