import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

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
 * Regenerate the full set of metrics afresh (clears the 'mertics' DB and repopulates)
 * @param {string} token
 */
export async function regenerateMetrics(token) {
  const requestUrl = new URL('regenerate', metricsEndpoint)
  await postJson(requestUrl, {
    ...getHeaders(token)
  })
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
