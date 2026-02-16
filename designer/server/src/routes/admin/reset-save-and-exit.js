import { Scopes, getErrorMessage } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { resetSaveAndExitRecord } from '~/src/services/formSubmissionService.js'

export const ROUTE_FULL_PATH = '/admin/reset-save-and-exit'

const schema = Joi.object({
  magicLinkId: Joi.string().guid().required().messages({
    '*': 'Enter the magic link ID',
    'string.guid': 'Enter the magic link ID in the correct format'
  })
})

/**
 * @param { string } heading - the text in the heading
 * @param { 'success' } [type] - the notification type
 */
export function generateMessage(heading, type) {
  return {
    html: `<h3 class="govuk-notification-banner__heading">${heading}</h3>`,
    type
  }
}

export function generateTitling() {
  const pageHeading = 'Admin tools'

  return {
    pageTitle: `${pageHeading} - reset save and exit`,
    pageHeading: {
      text: pageHeading
    },
    backLink: {
      text: 'Back to admin tools home',
      href: '/admin/index'
    }
  }
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { yar } = request

      const navigation = buildAdminNavigation('Admin tools')

      // Validation errors
      const validation = yar
        .flash(sessionNames.validationFailure.adminResetSaveAndExit)
        .at(0)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      const { formValues, formErrors } = validation ?? {}

      return h.view('admin/reset-save-and-exit', {
        ...generateTitling(),
        navigation,
        notification,
        errorList: buildErrorList(formErrors, ['magicLinkId']),
        formErrors,
        formValues
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.UserEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { action: string, magicLinkId: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { auth, yar, payload } = request
      const { token } = auth.credentials
      const { magicLinkId } = payload

      try {
        request.logger.info(
          `[resetSaveAndExit] Resetting save and exit ${magicLinkId} by ${auth.credentials.user?.email}`
        )

        const { recordFound } = await resetSaveAndExitRecord(magicLinkId, token)

        if (recordFound) {
          yar.flash(
            sessionNames.successNotification,
            generateMessage('The magic link has been reset', 'success')
          )

          request.logger.info(
            `[resetSaveAndExit] Reset save and exit ${magicLinkId} by ${auth.credentials.user?.email}`
          )
        } else {
          yar.flash(
            sessionNames.successNotification,
            generateMessage(
              'Failed to reset save and exit record - magic link not found'
            )
          )

          request.logger.info(
            `[resetSaveAndExit] Failed to reset save and exit ${magicLinkId} - record not found`
          )
        }
      } catch (err) {
        request.logger.error(
          err,
          `Failed to reset save and exit ${magicLinkId} - ${getErrorMessage(err)}`
        )

        throw err
      }

      // Redirect to same page
      return h
        .redirect('/admin/reset-save-and-exit')
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, err) => {
          return redirectWithErrors(
            request,
            h,
            err,
            sessionNames.validationFailure.adminResetSaveAndExit
          )
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.UserEdit}`]
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
