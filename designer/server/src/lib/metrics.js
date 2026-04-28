import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'

const metricsEndpoint = new URL('/report/', config.auditUrl)

/**
 * Get metrics
 */
export async function getMetrics() {
  const getJsonByType =
    /** @type {typeof getJson<{ overview: FormOverviewMetric[], totals: FormTotalsMetric }>} */ (
      getJson
    )

  const requestUrl = new URL(metricsEndpoint)
  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
