import {
  Scopes,
  privacyNoticeTextSchema,
  privacyNoticeTypeSchema,
  privacyNoticeUrlSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { privacyNoticyViewModel } from '~/src/models/forms/privacy-notice.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_PRIVACY_NOTICE =
  '/library/{slug}/edit/privacy-notice'

export const schema = Joi.object().keys({
  privacyNoticeType: privacyNoticeTypeSchema.required().messages({
    'any.required': 'Choose how you want to add a privacy notice'
  }),
  privacyNoticeText: Joi.when('privacyNoticeType', {
    is: 'text',
    then: privacyNoticeTextSchema.required().messages({
      'string.empty': 'Enter text for the privacy notice'
    }),
    otherwise: Joi.string().allow('')
  }),
  privacyNoticeUrl: Joi.when('privacyNoticeType', {
    is: 'link',
    then: privacyNoticeUrlSchema.required().messages({
      'string.empty': 'Enter a link to a privacy notice for this form',
      'string.uri':
        'Enter a link to a privacy notice for this form in the correct format',
      'string.uriCustomScheme':
        'Enter a link to a privacy notice for this form in the correct format'
    }),
    otherwise: Joi.string().allow('')
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

      const validation = yar
        .flash(sessionNames.validationFailure.privacyNotice)
        .at(0)

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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'privacyNoticeType' | 'privacyNoticeText' | 'privacyNoticeUrl'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_PRIVACY_NOTICE,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { privacyNoticeType, privacyNoticeText, privacyNoticeUrl } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id } = await forms.get(slug, token)

      // Update the metadata with the privacy notice url
      await forms.updateMetadata(
        id,
        { privacyNoticeType, privacyNoticeText, privacyNoticeUrl },
        token
      )

      yar.flash(
        sessionNames.successNotification,
        'Privacy notice has been updated'
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

            yar.flash(sessionNames.validationFailure.privacyNotice, {
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
