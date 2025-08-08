import { Scopes, submissionGuidanceSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import { submissionGuidanceViewModel } from '~/src/models/forms/submission-guidance.js'
import { formOverviewPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

export const ROUTE_PATH_EDIT_SUBMISSION_GUIDANCE =
  '/library/{slug}/edit/submission-guidance'

export const schema = Joi.object().keys({
  submissionGuidance: submissionGuidanceSchema.required().messages({
    'string.empty': 'Enter what will happen after a user submits a form'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_SUBMISSION_GUIDANCE,
    async handler(request, h) {
      const { auth, params, yar } = request
      const { slug } = params
      const { token } = auth.credentials

      const validation = yar
        .flash(sessionNames.validationFailure.submissionGuidance)
        .at(0)

      // Retrieve form by slug
      const metadata = await forms.get(slug, token)

      // Create the submission guidance view model
      const model = submissionGuidanceViewModel(metadata, validation)

      return h.view('forms/submission-guidance', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'submissionGuidance'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_SUBMISSION_GUIDANCE,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug } = params
      const { submissionGuidance } = payload
      const { token } = auth.credentials

      // Retrieve form by slug
      const { id } = await forms.get(slug, token)

      // Update the metadata with the submission guidance text
      await forms.updateMetadata(id, { submissionGuidance }, token)

      yar.flash(
        sessionNames.successNotification,
        'What happens after users submit their form has been updated'
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

            yar.flash(sessionNames.validationFailure.submissionGuidance, {
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
