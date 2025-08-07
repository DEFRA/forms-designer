import { Scopes, onlineTextSchema, onlineUrlSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import {
  allowDelete,
  onlineViewModel
} from '~/src/models/forms/contact/online.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_ONLINE_CONTACT =
  '/library/{slug}/edit/contact/online'

export const onlineContactSchema = Joi.object().keys({
  url: onlineUrlSchema
    .required()
    .when('_delete', { is: true, then: Joi.allow('') })
    .messages({
      'string.empty': 'Enter a contact link for support',
      'string.uri': 'Enter a contact link for support in the correct format',
      'string.uriCustomScheme':
        'Enter a contact link for support in the correct format'
    }),
  text: onlineTextSchema
    .required()
    .when('_delete', { is: true, then: Joi.allow('') })
    .messages({
      'string.empty': 'Enter text to describe the contact link for support'
    }),
  _delete: Joi.boolean()
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_ONLINE_CONTACT,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.contactOnline)
        .at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the online contact view model
      const model = onlineViewModel(metadata, validation)

      return h.view('forms/contact/online', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: FormMetadataContactOnline & { _delete: boolean } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_ONLINE_CONTACT,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { url, text, _delete } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)
      const { id, contact = {} } = metadata

      if (!_delete || allowDelete(metadata)) {
        // Update the metadata with the online contact details
        await forms.updateMetadata(
          id,
          {
            contact: { ...contact, online: _delete ? undefined : { url, text } }
          },
          token
        )

        yar.flash(
          sessionNames.successNotification,
          `Contact link for support has been ${_delete ? 'removed' : 'updated'}`
        )
      }

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: onlineContactSchema,
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

            yar.flash(sessionNames.validationFailure.contactOnline, {
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
 * @import { FormMetadataContactOnline } from '@defra/forms-model'
 */
