import { Readable } from 'node:stream'

import { FormStatus, Scopes, getErrorMessage } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'

import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import { getMetrics, regenerateMetrics } from '~/src/lib/metrics.js'
import { publishPlatformMetricsDownloadRequestedEvent } from '~/src/messaging/publish.js'
import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

const ROUTE_FULL_PATH = '/admin/form-metrics/{tab?}'
const ROUTE_ADMIN_INDEX = '/admin/index'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

/**
 * @param {{ overview: FormOverviewMetric[]}} metrics
 */
export function getLiveMetricsCsv(metrics) {
  const liveOnly = metrics.overview.filter(
    (ov) => ov.formStatus === FormStatus.Live
  )

  // Sort forms by name then status
  const formsSorted = liveOnly.toSorted((a, b) => {
    const formNameA = /** @type {string} */ (a.summaryMetrics.name)
    const formNameB = /** @type {string} */ (b.summaryMetrics.name)
    return `${formNameA}${a.formStatus}`.localeCompare(
      `${formNameB}${b.formStatus}`
    )
  })

  const contentOutput = /** @type {string[]} */ ([
    '"Form name","Form URL","Live submissions"'
  ])
  formsSorted.forEach((ov) => {
    const summaryMetrics = /** @type {{ name: string, slug: string }} */ (
      ov.summaryMetrics
    )
    contentOutput.push(
      `"${summaryMetrics.name}","${config.appBaseUrl}/library/${summaryMetrics.slug}","${ov.submissionsCount}"`
    )
  })
  return contentOutput
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { params } = request
      const { tab } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const isComponentUsage = tab === 'component-usage'

      const metrics = await getMetrics()
      const model = isComponentUsage
        ? metricsComponentUsageViewModel(metrics)
        : metricsFormActivityViewModel(metrics)

      const viewName = isComponentUsage
        ? 'admin/form-metrics-component-usage'
        : 'admin/form-metrics-form-activity'

      return h.view(viewName, {
        pageTitle: `${ADMIN_TOOLS} - ${METRICS_TITLE}`,
        pageHeading: { text: METRICS_TITLE },
        backLink: {
          text: 'Back to admin tools',
          href: ROUTE_ADMIN_INDEX
        },
        navigation,
        model
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsReport}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/admin/form-metrics-regenerate',
    handler(_request, h) {
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      return h.view('admin/form-metrics-regenerate', {
        pageTitle: `${ADMIN_TOOLS} - ${METRICS_TITLE}`,
        pageHeading: { text: METRICS_TITLE },
        backLink: {
          text: 'Back to admin tools',
          href: ROUTE_ADMIN_INDEX
        },
        navigation
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.RegenerateMetrics}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'POST',
    path: '/admin/form-metrics-regenerate',
    async handler(request, h) {
      const { auth } = request
      const { token } = auth.credentials
      await regenerateMetrics(token)
      return h.redirect(ROUTE_ADMIN_INDEX).code(StatusCodes.SEE_OTHER)
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.RegenerateMetrics}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { fileId: string }, Payload: { email: string } }>}
   */
  ({
    method: 'GET',
    path: '/admin/form-metrics-download',
    async handler(request, h) {
      const { auth } = request

      try {
        // Live metrics only
        const metrics = await getMetrics()
        const lines = getLiveMetricsCsv(metrics)

        const streamData = new Readable({
          read() {
            this.push(lines.join('\n'))
            this.push(null)
          }
        })

        const now = new Date()
        const filename = `live-submission-metrics-${format(now, 'yyyy-MM-dd')}.csv`

        const auditUser = mapUserForAudit(auth.credentials.user)
        await publishPlatformMetricsDownloadRequestedEvent(auditUser)

        return h
          .response(streamData)
          .header('Content-Type', 'text/csv')
          .header('Content-Disposition', 'attachment; filename= ' + filename)
      } catch (err) {
        logger.error(
          err,
          `[metrics] Error downloading all metrics - ${getErrorMessage(err)}`
        )
        throw err
      }
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsReport}`] }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { FormOverviewMetric } from '@defra/forms-model'
 */
