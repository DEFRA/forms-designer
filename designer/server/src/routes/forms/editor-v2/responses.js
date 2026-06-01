import { Scopes, isFeedbackForm } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  getUserScopes,
  mapUserForAudit
} from '~/src/common/helpers/auth/user-helper.js'
import * as forms from '~/src/lib/forms.js'
import { getMetricsForForm } from '~/src/lib/metrics.js'
import {
  publishFormCsatExcelRequestedEvent,
  publishFormSubmissionExcelRequestedEvent
} from '~/src/messaging/publish.js'
import { mapTotalMetrics } from '~/src/models/admin/metrics-helper.js'
import { tilePeriodNames } from '~/src/models/admin/metrics.js'
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
 * @param { string } email
 * @param { boolean } isSharedMailbox
 */
export function generateSuccessMessage(email, isSharedMailbox) {
  return `
  <h3 class="govuk-notification-banner__heading">
    We have emailed a link to your ${isSharedMailbox ? 'shared' : ''} mailbox
  </h3>
  <p class="govuk-body">This might take a couple of minutes.</p>
  <p class="govuk-body">${isSharedMailbox ? 'Shared mailbox' : 'Mailbox'}: ${email}</p>`
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

      const scopes = getUserScopes(auth)

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinitionWithLiveFallback(
        metadata,
        token
      )

      const formId = metadata.id

      const metricsModel = await getMetricTilesForForm(formId)

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
        isFeedbackForm: isFeedbackForm(definition),
        canRequestFeedback: scopes.includes(Scopes.FormsFeedback),
        metricsModel
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [Scopes.FormEdit, Scopes.FormsFeedback]
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
      const user = mapUserForAudit(auth.credentials.user)

      if (action === 'submissions' && metadata.notificationEmail) {
        const excelData = {
          formId: metadata.id,
          formName: metadata.title,
          notificationEmail: metadata.notificationEmail
        }

        await sendFormSubmissionsFile(metadata.id, token)
        await publishFormSubmissionExcelRequestedEvent(excelData, user)

        yar.flash(
          sessionNames.successNotification,
          generateSuccessMessage(metadata.notificationEmail, true)
        )
      } else {
        const userEmail = auth.credentials.user?.email
          ? auth.credentials.user.email.toLowerCase()
          : undefined

        if (userEmail) {
          const excelData = {
            formId: metadata.id,
            formName: metadata.title,
            notificationEmail: userEmail
          }

          await sendFeedbackSubmissionsFile(metadata.id, token)
          await publishFormCsatExcelRequestedEvent(excelData, user)

          yar.flash(
            sessionNames.successNotification,
            generateSuccessMessage(userEmail, false)
          )
        }
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
          scope: [Scopes.FormEdit, Scopes.FormsFeedback]
        }
      }
    }
  })
]

/**
 * @param {string} formId
 */
async function getMetricTilesForForm(formId) {
  const classes =
    'govuk-grid-column-one-third govuk-grid-column-one-third-from-tablet govuk-grid-column-one-third-from-desktop'
  const metrics = await getMetricsForForm(formId)
  const metricsModel = mapTotalMetrics(metrics.totals, tilePeriodNames)
  const submissionsTiles = {
    last7: metricsModel.last7Days.formSubmissions,
    last30: metricsModel.last30Days.formSubmissions,
    allTime: metricsModel.allTime.formSubmissions
  }
  // Disable drill-down
  submissionsTiles.last7.drillDown.enabled = false
  submissionsTiles.last30.drillDown.enabled = false
  submissionsTiles.allTime.drillDown.enabled = false
  // Override classes
  submissionsTiles.last7.classes = classes
  submissionsTiles.last30.classes = classes
  submissionsTiles.allTime.classes = classes
  // Override titles
  submissionsTiles.last7.title = 'Last 7 days'
  submissionsTiles.last30.title = 'Last 30 days'
  submissionsTiles.allTime.title = `All time - since ${format(metrics.totals.earliestDate, 'd MMM yyyy')}`
  return metricsModel
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { FormMetadata } from '@defra/forms-model'
 */
