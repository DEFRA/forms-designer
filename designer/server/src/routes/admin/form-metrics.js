import { Readable } from 'node:stream'

import { FormMetricName, Scopes, getErrorMessage } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  MetricsFilterFields,
  getMetrics,
  regenerateMetrics
} from '~/src/lib/metrics.js'
import { publishPlatformMetricsDownloadRequestedEvent } from '~/src/messaging/publish.js'
import {
  getLiveMetricsAsCsv,
  metricsComponentUsageViewModel,
  metricsDrilldownViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

const ROUTE_FULL_PATH = '/admin/form-metrics/{tab?}'
const ROUTE_BASE_PATH = '/admin/form-metrics'
const ROUTE_ADMIN_INDEX = '/admin/index'
const ROUTE_DRILLDOWN_PATH =
  '/admin/form-metrics/drilldown/{period}/{metricName}'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

const SHOW_FILTER = 'showFilter'

const filterAndSortSchema = Joi.object({
  // Sorting
  sortCol: Joi.string().optional(),
  sortDir: Joi.string().valid('asc', 'desc').optional(),
  // Filtering
  searchText: Joi.string().optional().allow(''),
  status: Joi.array()
    .items(Joi.string().valid('draft', 'live'))
    .single()
    .optional(),
  org: Joi.array().items(Joi.string()).single().optional(),
  action: Joi.string().valid('clear').optional().allow(''),
  showFilter: Joi.string().valid('Y', 'N').allow('')
})

const drilldownParamSchema = Joi.object({
  period: Joi.string().required(),
  metricName: Joi.string()
    .valid(...Object.values(FormMetricName))
    .required()
})

/**
 * @param {FilterAndSortCriteria} payload
 */
export function buildQueryFromPayload(payload) {
  if (payload.action === 'clear') {
    return ''
  }

  const params = new URLSearchParams()
  if (payload.searchText) {
    params.set(MetricsFilterFields.SearchText, payload.searchText.trim())
    params.set(SHOW_FILTER, 'Y')
  }
  if (payload.status) {
    payload.status.forEach((st) => {
      params.append(MetricsFilterFields.Status, st)
    })
    params.set(SHOW_FILTER, 'Y')
  }
  if (payload.org) {
    payload.org.forEach((org) => {
      params.append(MetricsFilterFields.Org, org)
    })
    params.set(SHOW_FILTER, 'Y')
  }
  if (payload.showFilter === 'Y' || payload.showFilter === 'N') {
    params.set(SHOW_FILTER, payload.showFilter)
  }
  return params.size ? `?${params.toString()}` : ''
}

export default [
  /**
   * @satisfies {ServerRoute< { Params: { tab?: string }, Query: FilterAndSortCriteria } >}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { params, query } = request
      const { tab } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const isComponentUsage = tab === 'component-usage'

      const metrics = await getMetrics(query)
      const model = isComponentUsage
        ? metricsComponentUsageViewModel(metrics)
        : metricsFormActivityViewModel(metrics, query)

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
      },
      validate: {
        query: filterAndSortSchema
      }
    }
  }),

  /**
   * @satisfies {ServerRoute< { Payload: FilterAndSortCriteria } >}
   */
  ({
    method: 'POST',
    path: ROUTE_BASE_PATH,
    handler(request, h) {
      const { payload } = request
      const queryStr = buildQueryFromPayload(payload)
      return h.redirect(`${ROUTE_BASE_PATH}${queryStr}`)
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsReport}`] }
      },
      validate: {
        payload: filterAndSortSchema
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
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/admin/form-metrics-download',
    async handler(request, h) {
      const { auth } = request

      try {
        // Live metrics only
        const metrics = await getMetrics()
        const lines = await getLiveMetricsAsCsv(metrics)

        const streamData = new Readable({
          read() {
            this.push(lines)
            this.push(null)
          }
        })

        const now = new Date()
        const filename = `live-metrics-${format(now, 'yyyy-MM-dd')}.csv`

        const auditUser = mapUserForAudit(auth.credentials.user)
        await publishPlatformMetricsDownloadRequestedEvent(auditUser)

        return h
          .response(streamData)
          .header('Content-Type', 'text/csv; charset=utf-8')
          .header('Content-Disposition', `attachment; filename="${filename}"`)
      } catch (err) {
        logger.error(
          err,
          `[metrics] Error downloading live metrics - ${getErrorMessage(err)}`
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
  }),

  /**
   * @satisfies {ServerRoute< { Params: { period: string, metricName: FormMetricName } } >}
   */
  ({
    method: 'GET',
    path: ROUTE_DRILLDOWN_PATH,
    async handler(request, h) {
      const { params } = request
      const { period, metricName } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const metrics = await getMetrics()
      const model = metricsDrilldownViewModel(metrics, period, metricName)

      return h.view('admin/form-metrics-drilldown', {
        pageTitle: `${ADMIN_TOOLS} - ${METRICS_TITLE}`,
        pageHeading: { text: METRICS_TITLE },
        backLink: {
          text: 'Back to overview metrics',
          href: `/admin/form-metrics/#${period}`
        },
        navigation,
        model
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsReport}`] }
      },
      validate: {
        params: drilldownParamSchema
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { FilterAndSortCriteria } from '~/src/models/admin/metrics-helper.js'
 */
