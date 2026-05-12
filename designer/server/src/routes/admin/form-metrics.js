import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { getMetrics, regenerateMetrics } from '~/src/lib/metrics.js'
import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

const ROUTE_FULL_PATH = '/admin/form-metrics/{tab?}'
const ROUTE_BASE_PATH = '/admin/form-metrics'
const ROUTE_ADMIN_INDEX = '/admin/index'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

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

/**
 * @param {FilterAndSortCriteria} payload
 */
export function buildQueryFromPayload(payload) {
  if (payload.action === 'clear') {
    return ''
  }

  const params = new URLSearchParams()
  if (payload.showFilter === 'N') {
    params.set('showFilter', 'N')
  }
  if (payload.searchText) {
    params.set('searchText', encodeURI(payload.searchText))
  }
  if (payload.status) {
    payload.status.forEach((st) => {
      params.append('status', st)
    })
  }
  if (payload.org) {
    payload.org.forEach((org) => {
      params.append('org', encodeURI(org))
    })
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { FilterAndSortCriteria } from '~/src/models/admin/metrics-helper.js'
 */
