import {
  declarationTextSchema,
  needDeclarationSchema
} from '@defra/forms-model'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/check-answers-settings.js'

export const ROUTE_FULL_PATH_CHECK_ANSWERS_SETTINGS = `/library/{slug}/editor-v2/page/{pageId}/check-answers-settings`

const errorKey = sessionNames.validationFailure.editorQuestions
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  needDeclaration: needDeclarationSchema,
  declarationTextSchema: Joi.when('needDeclaration', {
    is: 'true',
    then: declarationTextSchema.required().messages({
      '*': 'Enter the information you need users to declare or agree to'
    })
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CHECK_ANSWERS_SETTINGS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId } = params

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // TODO - merge with later code
      // Validation errors
      const validation = /** @type {ValidationFailure<FormEditor>} */ (
        yar.flash(errorKey).at(0)
      )

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/check-answers-settings',
        viewModel.checkAnswersSettingsViewModel(
          metadata,
          definition,
          pageId,
          validation,
          notification
        )
      )
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
  })
]

/**
 * @import { FormEditor } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
