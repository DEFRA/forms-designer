import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { getMetrics, regenerateMetrics } from '~/src/lib/metrics.js'
import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

const ROUTE_FULL_PATH = '/admin/form-metrics/{tab?}'
const ROUTE_ADMIN_INDEX = '/admin/index'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

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
        access: { entity: 'user', scope: [`+${Scopes.FormsReport}`] }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
