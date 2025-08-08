import { Scopes, notificationEmailAddressSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { notificationEmailViewModel } from '~/src/models/forms/notification-email.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_NOTIFICATION_EMAIL =
  '/library/{slug}/edit/notification-email'

export const EMPTY_MESSAGE =
  'Enter an email address that submitted forms should be sent to'
export const INCORRECT_FORMAT_MESSAGE =
  'Enter an email address that submitted forms should be sent to in the correct format'

export const schema = Joi.object().keys({
  notificationEmail: notificationEmailAddressSchema.required().messages({
    'string.empty': EMPTY_MESSAGE,
    'string.email': INCORRECT_FORMAT_MESSAGE,
    'string.pattern.base': INCORRECT_FORMAT_MESSAGE
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_NOTIFICATION_EMAIL,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.notificationEmail)
        .at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the notification email view model
      const model = notificationEmailViewModel(metadata, validation)

      return h.view('forms/notification-email', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'notificationEmail'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_NOTIFICATION_EMAIL,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { notificationEmail } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id } = await forms.get(slug, token)

      // Update the metadata with the notification email
      await forms.updateMetadata(
        id,
        {
          notificationEmail: notificationEmail?.toLowerCase()
        },
        token
      )

      yar.flash(
        sessionNames.successNotification,
        'Email address for sending submitted forms has been updated'
      )

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
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

            yar.flash(sessionNames.validationFailure.notificationEmail, {
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
 * @import { FormMetadataInput } from '@defra/forms-model'
 */
