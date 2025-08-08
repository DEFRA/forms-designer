import {
  Scopes,
  emailAddressSchema,
  emailResponseTimeSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import {
  allowDelete,
  emailViewModel
} from '~/src/models/forms/contact/email.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_EMAIL_CONTACT =
  '/library/{slug}/edit/contact/email'

export const emailContactSchema = Joi.object().keys({
  address: emailAddressSchema
    .required()
    .when('_delete', { is: true, then: Joi.allow('') })
    .messages({
      'string.empty': 'Enter an email address for dedicated support',
      'string.email':
        'Enter an email address for dedicated support in the correct format'
    }),
  responseTime: emailResponseTimeSchema
    .required()
    .when('_delete', { is: true, then: Joi.allow('') })
    .messages({
      'string.empty': 'Enter a response time for receiving responses'
    }),
  _delete: Joi.boolean()
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_EMAIL_CONTACT,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.contactEmail)
        .at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the email contact view model
      const model = emailViewModel(metadata, validation)

      return h.view('forms/contact/email', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: FormMetadataContactEmail & { _delete: boolean } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_EMAIL_CONTACT,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { address, responseTime, _delete } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)
      const { id, contact = {} } = metadata

      if (!_delete || allowDelete(metadata)) {
        // Update the metadata with the email contact details
        await forms.updateMetadata(
          id,
          {
            contact: {
              ...contact,
              email: _delete ? undefined : { address, responseTime }
            }
          },
          token
        )

        yar.flash(
          sessionNames.successNotification,
          `Email address for support has been ${_delete ? 'removed' : 'updated'}`
        )
      }

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: emailContactSchema,
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

            yar.flash(sessionNames.validationFailure.contactEmail, {
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
 * @import { FormMetadataContactEmail } from '@defra/forms-model'
 */
