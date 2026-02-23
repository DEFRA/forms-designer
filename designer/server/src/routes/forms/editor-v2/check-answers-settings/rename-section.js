import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { renameSectionTitle } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/rename-section.js'

const errorKey = sessionNames.validationFailure.editorRenameSection

export const ROUTE_PATH_RENAME_SECTION =
  '/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/rename-section/{sectionId}'

export const schema = Joi.object().keys({
  sectionTitle: Joi.string()
    .trim()
    .required()
    .description('Human-readable section title displayed to users')
    .messages({
      'string.empty': 'Enter a section title'
    })
})

/**
 * @param {string} slug
 * @param {string} pageId
 */
function getReturnUrl(slug, pageId) {
  return `/library/${slug}/editor-v2/page/${pageId}/check-answers-settings/sections`
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_RENAME_SECTION,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, sectionId } = params

      // Form metadata and definition
      const metadata = await forms.get(slug, token)
      const formId = metadata.id
      const definition = await forms.getDraftFormDefinition(formId, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      return h.view(
        'forms/question-input',
        viewModel.renameSectionViewModel(
          definition,
          sectionId,
          getReturnUrl(slug, pageId),
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
   * @satisfies {ServerRoute<{ Payload: FormEditor }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_RENAME_SECTION,
    async handler(request, h) {
      const { auth, payload, params, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, sectionId } = params

      // Form metadata
      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      await renameSectionTitle(formId, token, sectionId, payload.sectionTitle)

      yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

      return h.redirect(getReturnUrl(slug, pageId)).code(StatusCodes.SEE_OTHER)
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
 * @import { FormEditor } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
