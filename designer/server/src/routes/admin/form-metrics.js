import { Scopes } from '@defra/forms-model'

import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { getMetrics } from '~/src/lib/metrics.js'
import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

export const ROUTE_FULL_PATH = '/admin/form-metrics/{tab?}'

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
          href: '/admin/index'
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
