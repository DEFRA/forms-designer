import { FormMetricName, Scopes, getErrorMessage } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  MetricsFilterFields,
  getDrilldownMetrics,
  getMetrics,
  regenerateMetrics
} from '~/src/lib/metrics.js'
import { publishPlatformMetricsDownloadRequestedEvent } from '~/src/messaging/publish.js'
import { getMetricsAsExcel } from '~/src/models/admin/metrics-excel.js'
import {
  getPeriodNameFromSlug,
  metricsComponentUsageViewModel,
  metricsDrilldownViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

const ROUTE_FULL_PATH = '/admin/form-metrics/{tab}/{activityType?}'
const ROUTE_BASE_PATH = '/admin/form-metrics'
const ROUTE_ADMIN_INDEX = '/admin/index'
const ROUTE_DRILLDOWN_PATH =
  '/admin/form-metrics/drilldown/{period}/{metricName}/{language?}'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

const SHOW_FILTER = 'showFilter'

const COMPONENT_USAGE_TAB = 'component-usage'
const FORM_ACTIVITY_TAB = 'form-activity'

export const FORM_ACTIVITY_OPTION_ALL = 'all'
export const FORM_ACTIVITY_OPTION_WELSH = 'cy'

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
  showFilter: Joi.string().valid('Y', 'N').allow(''),
  activityType: Joi.string()
    .valid(FORM_ACTIVITY_OPTION_ALL, FORM_ACTIVITY_OPTION_WELSH)
    .optional(),
  restoreFilter: Joi.string().valid('Y').optional(),
  currentTab: Joi.string().optional()
})

const drilldownParamSchema = Joi.object({
  period: Joi.string().required(),
  metricName: Joi.string()
    .valid(...Object.values(FormMetricName))
    .required(),
  language: Joi.string().optional()
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

/**
 * @param {string} activityType
 */
function getSessionKey(activityType) {
  return `metrics-filter-${activityType}`
}

export default [
  /**
   * @satisfies {ServerRoute< { Params: { tab: string, activityType?: string }, Query: FilterAndSortCriteria } >}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { params, query } = request
      const { tab, activityType } = params

      if (!activityType) {
        return h.redirect(`${ROUTE_BASE_PATH}/${tab}/all`)
      }

      if (tab === FORM_ACTIVITY_TAB) {
        if (query.restoreFilter) {
          const savedFilter =
            /** @type {string} */ (
              request.yar.get(getSessionKey(activityType))
            ) ?? ''
          return h.redirect(
            `${ROUTE_BASE_PATH}/${tab}/${activityType}${savedFilter}`
          )
        }

        // Save filter in case user switches tabs and returns
        request.yar.set(getSessionKey(activityType), request.url.search)
      }

      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const filter =
        activityType && activityType !== 'all'
          ? {
              ...query,
              language: activityType
            }
          : query

      const metrics = await getMetrics(filter)

      let model
      let viewName
      if (tab === COMPONENT_USAGE_TAB) {
        model = metricsComponentUsageViewModel(metrics)
        viewName = 'admin/form-metrics-component-usage'
      } else {
        model = metricsFormActivityViewModel(metrics, filter, activityType)
        viewName = 'admin/form-metrics-form-activity'
      }

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
   * @satisfies {ServerRoute< { Payload: FilterAndSortCriteria, Params: { tab: string, activityType?: string } } >}
   */
  ({
    method: 'POST',
    path: `${ROUTE_BASE_PATH}/{tab}/{activityType?}`,
    handler(request, h) {
      const { payload, params } = request
      const { activityType, tab } = params

      // Retain tab selection if passed in payload
      const tabAnchor = payload.currentTab
        ? payload.currentTab.replace('tab_', '#')
        : ''

      // User has switched views using the radio options
      // Restore their previous filter criteria
      if (payload.restoreFilter) {
        // Toggle activityType
        const toggled =
          activityType === FORM_ACTIVITY_OPTION_ALL
            ? FORM_ACTIVITY_OPTION_WELSH
            : FORM_ACTIVITY_OPTION_ALL
        const savedFilter =
          /** @type {string} */ (request.yar.get(getSessionKey(toggled))) ?? ''
        return h.redirect(
          `${ROUTE_BASE_PATH}/${tab}/${toggled}${tabAnchor}${savedFilter}`
        )
      }

      const queryStr = buildQueryFromPayload(payload)
      const resolvedActivityType = payload.activityType ?? activityType
      const subPath =
        tab === FORM_ACTIVITY_TAB &&
        resolvedActivityType !== FORM_ACTIVITY_OPTION_ALL
          ? `/${resolvedActivityType}`
          : `/${FORM_ACTIVITY_OPTION_ALL}`
      return h.redirect(
        `${ROUTE_BASE_PATH}/${tab}${subPath}${tabAnchor}${queryStr}`
      )
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
        // Live metrics only - for all forms
        const metrics = await getMetrics()
        // Live metrics only - for Welsh forms
        const metricsWelsh = await getMetrics({ language: 'cy' })

        const buffer = getMetricsAsExcel(metrics, metricsWelsh)

        const now = new Date()
        const filename = `form-metrics-${format(now, 'yyyy-MM-dd')}.xlsx`

        const auditUser = mapUserForAudit(auth.credentials.user)
        await publishPlatformMetricsDownloadRequestedEvent(auditUser)

        return h
          .response(buffer)
          .header(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
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
   * @satisfies {ServerRoute< { Params: { period: string, metricName: FormMetricName, language?: string } } >}
   */
  ({
    method: 'GET',
    path: ROUTE_DRILLDOWN_PATH,
    async handler(request, h) {
      const { params } = request
      const { language, period, metricName } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const periodName = getPeriodNameFromSlug(period)

      // Get tile metrics, for period ranges and form details lookups
      const tileMetrics = await getMetrics(language ? { language } : {})

      const drilldownMetrics = await getDrilldownMetrics(
        periodName,
        metricName,
        language
      )

      const model = metricsDrilldownViewModel(
        tileMetrics,
        drilldownMetrics,
        period,
        metricName,
        language
      )

      return h.view('admin/form-metrics-drilldown', {
        pageTitle: `${ADMIN_TOOLS} - ${METRICS_TITLE}`,
        pageHeading: { text: METRICS_TITLE },
        backLink: {
          text: 'Back to overview metrics',
          href: `/admin/form-metrics/form-activity/${language ?? FORM_ACTIVITY_OPTION_ALL}?restoreFilter=Y#${period}`
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
