import { onlineTextSchema, onlineUrlSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { onlineViewModel } from '~/src/models/forms/contact.js'

export const ROUTE_PATH_EDIT_ONLINE_CONTACT =
  '/library/{slug}/edit/contact/online'

export const onlineContactSchema = Joi.object().keys({
  url: onlineUrlSchema.required().messages({
    'string.empty': 'Enter a contact link for support',
    'string.uri': 'Enter a contact link for support in the correct format',
    'string.uriCustomScheme':
      'Enter a contact link for support in the correct format'
  }),
  text: onlineTextSchema.required().messages({
    'string.empty': 'Enter text to describe the contact link for support'
  })
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

      const validation = yar.flash(sessionNames.validationFailure).at(0)

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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: { url: string, text: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_ONLINE_CONTACT,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { url, text } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id, contact = {} } = await forms.get(slug, token)

      // Update the metadata with the online contact details
      await forms.updateMetadata(
        id,
        { contact: { ...contact, online: { url, text } } },
        token
      )

      yar.flash(
        sessionNames.successNotification,
        'Contact link for support has been updated'
      )

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
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

            yar.flash(sessionNames.validationFailure, {
              formErrors,
              formValues: {
                contact: { online: payload }
              }
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
 */
