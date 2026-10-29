import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { setFormOption } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/reuse-previous-answers.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_REUSE_PREVIOUS_ANSWERS =
  '/library/{slug}/editor-v2/reuse-previous-answers'

export const SELECT_OPTION_MESSAGE =
  'Select whether people can reuse answers from a previous submission'

export const REUSE_PREVIOUS_ANSWERS_ENABLED =
  'Reuse previous answers has been enabled'

export const REUSE_PREVIOUS_ANSWERS_DISABLED =
  'Reuse previous answers has been disabled'

const errorKey = sessionNames.validationFailure.editorReusePreviousAnswers
const notificationKey = sessionNames.successNotification

// Saved to the form definition as `metadata.options.allowCopy`. Turning it on
// also turns on the reference number and confirmation email (in forms-manager)
const ALLOW_COPY_OPTION_KEY = 'allowCopy'

export const schema = Joi.object().keys({
  reusePreviousAnswers: Joi.boolean().required().messages({
    '*': SELECT_OPTION_MESSAGE
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_REUSE_PREVIOUS_ANSWERS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      return h.view(
        'forms/editor-v2/reuse-previous-answers',
        viewModel.reusePreviousAnswersViewModel(
          metadata,
          definition,
          validation
        )
      )
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: { reusePreviousAnswers: boolean } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_REUSE_PREVIOUS_ANSWERS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { token } = auth.credentials
      const { slug } = params
      const { reusePreviousAnswers } = payload

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const currentValue = definition.metadata?.options?.allowCopy ?? false

      // Only save when the setting changes, so an unchanged save does not
      // update the draft or add an audit record
      if (reusePreviousAnswers !== currentValue) {
        await setFormOption(
          metadata.id,
          token,
          ALLOW_COPY_OPTION_KEY,
          reusePreviousAnswers ? 'true' : 'false'
        )

        yar.flash(
          notificationKey,
          reusePreviousAnswers
            ? REUSE_PREVIOUS_ANSWERS_ENABLED
            : REUSE_PREVIOUS_ANSWERS_DISABLED
        )
      }

      return h
        .redirect(editorv2Path(slug, 'advanced-settings'))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
