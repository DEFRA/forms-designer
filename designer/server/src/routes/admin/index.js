import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { getUser } from '~/src/lib/manage.js'
import { sendFeedbackSubmissionsFile } from '~/src/services/formSubmissionService.js'

export const ROUTE_FULL_PATH = '/admin/index'

const schema = Joi.object({
  action: Joi.string().valid('feedback').required()
})

/**
 * @param { string | undefined } email
 */
export function generateSuccessMessage(email) {
  return `
  <h3 class="govuk-notification-banner__heading">
    We have emailed a link to your email
  </h3>
  <p class="govuk-body">This might take a couple of minutes.</p>
  <p class="govuk-body">Email: ${email}</p>`
}

export function generateTitling() {
  const pageTitle = 'Admin tools'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    backLink: {
      text: 'Back to form library',
      href: '/library'
    }
  }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { yar } = request

      const navigation = buildAdminNavigation('Admin tools')

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view('admin/index', {
        ...generateTitling(),
        navigation,
        notification
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string }, Payload: { action: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { auth, yar } = request
      const { token } = auth.credentials

      // Request all forms by omitting the formId
      await sendFeedbackSubmissionsFile(undefined, token)

      const user = mapUserForAudit(auth.credentials.user)
      const { email } = await getUser(token, user.id)

      yar.flash(
        sessionNames.successNotification,
        generateSuccessMessage(email.toLowerCase())
      )

      // Redirect to same page
      return h.redirect('/admin/index').code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema
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
 * @import { FormMetadata } from '@defra/forms-model'
 */
