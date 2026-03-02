import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { termsAndConditionsViewModel } from '~/src/models/forms/terms-and-conditions.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_TERMS_AND_CONDITIONS =
  '/library/{slug}/edit/terms-and-conditions'

export const schema = Joi.object().keys({
  termsAndConditionsAgreed: Joi.string().valid('true').required().messages({
    '*': 'You must confirm you meet the terms and conditions to continue'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_TERMS_AND_CONDITIONS,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.termsAndConditions)
        .at(0)

      const metadata = await forms.get(slug, token)

      const model = termsAndConditionsViewModel(metadata, validation)

      return h.view('forms/terms-and-conditions', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: { termsAndConditionsAgreed: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_TERMS_AND_CONDITIONS,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const { id } = await forms.get(slug, token)

      await forms.updateMetadata(id, { termsAndConditionsAgreed: true }, token)

      yar.flash(
        sessionNames.successNotification,
        'Terms and conditions accepted'
      )

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) =>
          redirectWithErrors(
            request,
            h,
            error,
            sessionNames.validationFailure.termsAndConditions
          )
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
 * @import { ServerRoute } from '@hapi/hapi'
 */
