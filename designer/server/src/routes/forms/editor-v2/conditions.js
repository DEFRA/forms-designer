import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { setPageCondition } from '~/src/lib/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/conditions.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_CONDITIONS = '/library/{slug}/editor-v2/conditions'
export const ROUTE_FULL_PATH_PAGE_CONDITIONS =
  '/library/{slug}/editor-v2/page/{pageId}/conditions'

const notificationKey = sessionNames.successNotification
const errorKey = sessionNames.validationFailure.editorPageConditions

const pageConditionsSchema = Joi.object({
  action: Joi.string().valid('add', 'remove').required(),
  conditionName: Joi.string().when('action', {
    is: 'add',
    then: Joi.required().messages({
      '*': 'Select existing condition'
    }),
    otherwise: Joi.optional()
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CONDITIONS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      const definition = await forms.getDraftFormDefinition(formId, token)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/conditions',
        viewModel.conditionsViewModel(metadata, definition, notification)
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
  }),
  /**
   * @satisfies {ServerRoute<{ Payload: { action: 'add' | 'remove', conditionName?: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE_CONDITIONS,
    async handler(request, h) {
      const { params, auth, payload, yar, query } = request
      const { token } = auth.credentials
      const { slug, pageId } = params
      const { action, conditionName } = payload

      const { questionId, stateId } = query

      try {
        const metadata = await forms.get(slug, token)
        const formId = metadata.id

        if (action === 'add' && conditionName) {
          await setPageCondition(formId, token, pageId, conditionName)
        } else if (action === 'remove') {
          await setPageCondition(formId, token, pageId, null)
        }

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        const redirectUrl =
          questionId && stateId
            ? editorv2Path(
                slug,
                `page/${pageId}/question/${questionId}/details/${stateId}#tab-conditions`
              )
            : editorv2Path(slug, `page/${pageId}/questions`)

        return h.redirect(redirectUrl).code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          const errorRedirectUrl = query.returnUrl
            ? `${query.returnUrl}#tab-conditions`
            : editorv2Path(slug, `page/${pageId}/questions`)

          return redirectWithErrors(
            request,
            h,
            error,
            errorKey,
            errorRedirectUrl
          )
        }
        throw err
      }
    },
    options: {
      validate: {
        payload: pageConditionsSchema,
        failAction: (request, h, error) => {
          const { params, query } = request
          const { slug, pageId } = params

          addErrorsToSession(request, error, errorKey)

          const { questionId, stateId } = query
          const redirectUrl =
            questionId && stateId
              ? editorv2Path(
                  slug,
                  `page/${pageId}/question/${questionId}/details/${stateId}#tab-conditions`
                )
              : editorv2Path(slug, `page/${pageId}/questions`)

          return h.redirect(redirectUrl).code(StatusCodes.SEE_OTHER).takeover()
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
 * @import { ServerRoute } from '@hapi/hapi'
 * @import Boom from '@hapi/boom'
 */
