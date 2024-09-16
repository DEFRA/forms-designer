import { emailAddressSchema, emailResponseTimeSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { emailViewModel } from '~/src/models/forms/contact/email.js'

export const ROUTE_PATH_EDIT_EMAIL_CONTACT =
  '/library/{slug}/edit/contact/email'

export const emailContactSchema = Joi.object().keys({
  address: emailAddressSchema.required().messages({
    'string.empty': 'Enter an email address for dedicated support',
    'string.email':
      'Enter an email address for dedicated support in the correct format'
  }),
  responseTime: emailResponseTimeSchema.required().messages({
    'string.empty': 'Enter a response time for receiving responses'
  })
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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: FormMetadataContactEmail }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_EMAIL_CONTACT,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { address, responseTime } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id, contact = {} } = await forms.get(slug, token)

      // Update the metadata with the email contact details
      await forms.updateMetadata(
        id,
        { contact: { ...contact, email: { address, responseTime } } },
        token
      )

      yar.flash(
        sessionNames.successNotification,
        'Email address for support has been updated'
      )

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { FormMetadataContactEmail } from '@defra/forms-model'
 */
