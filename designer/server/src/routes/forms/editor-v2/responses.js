import { Scopes, isFeedbackForm } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import * as forms from '~/src/lib/forms.js'
import {
  publishFormCsatExcelRequestedEvent,
  publishFormSubmissionExcelRequestedEvent
} from '~/src/messaging/publish.js'
import { getFormSpecificNavigation } from '~/src/models/forms/library.js'
import { formOverviewPath } from '~/src/models/links.js'
import {
  sendFeedbackSubmissionsFile,
  sendFormSubmissionsFile
} from '~/src/services/formSubmissionService.js'

export const ROUTE_FULL_PATH_RESPONSES = '/library/{slug}/editor-v2/responses'

const schema = Joi.object({
  action: Joi.string().valid('submissions', 'feedback').required()
})

/**
 * @param { string | undefined } email
 */
export function generateSuccessMessage(email) {
  return `
  <h3 class="govuk-notification-banner__heading">
    We have emailed a link to your shared mailbox
  </h3>
  <p class="govuk-body">This might take a couple of minutes.</p>
  <p class="govuk-body">Shared mailbox: ${email}</p>`
}

/**
 * @param {FormMetadata} metadata
 */
export function generateTitling(metadata) {
  const pageTitle = 'Download responses as an Excel spreadsheet'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    caption: {
      text: metadata.title
    },
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @param {FormMetadata} metadata
 */
export function generateErrorList(metadata) {
  return metadata.notificationEmail
    ? []
    : [
        {
          html: `You need to <a href="/library/${metadata.slug}/edit/notification-email" class="govuk-link govuk-link--no-visited-state">set a shared mailbox</a> in the form overview to send data to a shared mailbox.`
        }
      ]
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_RESPONSES,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const formId = metadata.id

      const errorList = generateErrorList(metadata)

      const formPath = formOverviewPath(slug)

      const navigation = getFormSpecificNavigation(
        formPath,
        metadata,
        definition,
        'Responses'
      )

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view('forms/editor-v2/responses', {
        ...generateTitling(metadata),
        formId,
        errorList,
        navigation,
        notification,
        isFeedbackForm: isFeedbackForm(definition)
      })
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string }, Payload: { action: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_RESPONSES,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug } = params
      const { token } = auth.credentials
      const { action } = payload

      const metadata = await forms.get(slug, token)

      if (metadata.notificationEmail) {
        const user = mapUserForAudit(auth.credentials.user)
        const excelData = {
          formId: metadata.id,
          formName: metadata.title,
          notificationEmail: metadata.notificationEmail
        }

        if (action === 'submissions') {
          await sendFormSubmissionsFile(metadata.id, token)
          await publishFormSubmissionExcelRequestedEvent(excelData, user)
        } else {
          await sendFeedbackSubmissionsFile(metadata.id, token)
          await publishFormCsatExcelRequestedEvent(excelData, user)
        }

        yar.flash(
          sessionNames.successNotification,
          generateSuccessMessage(metadata.notificationEmail)
        )
      }

      // Redirect to same page
      return h
        .redirect(`/library/${slug}/editor-v2/responses`)
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema
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
 * @import { FormMetadata } from '@defra/forms-model'
 */
