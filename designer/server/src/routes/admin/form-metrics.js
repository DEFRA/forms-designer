import { Scopes } from '@defra/forms-model'

import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { getMetrics } from '~/src/lib/metrics.js'
import { metricsViewModel } from '~/src/models/admin/metrics.js'

export const ROUTE_FULL_PATH = '/admin/form-metrics'

const ADMIN_TOOLS = 'Admin tools'
const METRICS_TITLE = 'Defra Form Designer metrics'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(_request, h) {
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const metrics = await getMetrics()
      const model = metricsViewModel(metrics)

      return h.view('admin/form-metrics', {
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
