import { privacyNoticeUrlSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { privacyNoticyViewModel } from '~/src/models/forms/privacy-notice.js'

export const ROUTE_PATH_EDIT_PRIVACY_NOTICE =
  '/library/{slug}/edit/privacy-notice'

export const schema = Joi.object().keys({
  privacyNoticeUrl: privacyNoticeUrlSchema.required().messages({
    'string.empty': 'Enter a link to a privacy notice for this form',
    'string.uri':
      'Enter a link to a privacy notice for this form in the correct format',
    'string.uriCustomScheme':
      'Enter a link to a privacy notice for this form in the correct format'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_PRIVACY_NOTICE,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar.flash(sessionNames.validationFailure).at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the privacy notice view model
      const model = privacyNoticyViewModel(metadata, validation)

      return h.view('forms/privacy-notice', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: { privacyNoticeUrl : string } }>}
   */
  ({
    method: 'post',
    path: ROUTE_PATH_EDIT_PRIVACY_NOTICE,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { privacyNoticeUrl } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id } = await forms.get(slug, token)

      // Update the metadata with the privacy notice url
      await forms.updateMetadata(id, { privacyNoticeUrl }, token)

      yar.flash(
        sessionNames.successNotification,
        'Link to a privacy notice has been updated'
      )

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
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

            yar.flash(sessionNames.validationFailure, {
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
 */
