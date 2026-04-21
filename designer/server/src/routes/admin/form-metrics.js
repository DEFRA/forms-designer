import { Scopes } from '@defra/forms-model'

import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

export const ROUTE_FULL_PATH = '/admin/form-metrics'

const ADMIN_TOOLS = 'Admin tools'

/**
 * @param {any} _metrics
 */
export function metricsViewModel(_metrics) {
  return {}
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      // const { params } = request
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const metrics = {} // await getMetrics('FormActivity')
      const model = metricsViewModel(metrics)

      return h.view('admin/form-metrics', {
        pageTitle: `${ADMIN_TOOLS} - Defra Form Designer metrics`,
        pageHeading: { text: ADMIN_TOOLS },
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
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] } // scope: [`+${Scopes.FormsReport}`] }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
