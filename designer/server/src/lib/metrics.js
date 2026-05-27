import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const metricsEndpoint = new URL('/report/', config.auditUrl)

export const MetricsFilterFields = {
  SearchText: 'searchText',
  Status: 'status',
  Org: 'org'
}

/**
 * Get metrics
 * @param {FilterCriteria} [filter]
 */
export async function getMetrics(filter = {}) {
  const getJsonByType =
    /** @type {typeof getJson<{ overview: FormOverviewMetric[], totals: FormTotalsMetric }>} */ (
      getJson
    )

  const requestUrl = new URL(metricsEndpoint)

  if (filter.searchText) {
    requestUrl.searchParams.set(
      MetricsFilterFields.SearchText,
      filter.searchText
    )
  }

  if (filter.status) {
    filter.status.forEach((st) => {
      requestUrl.searchParams.append(MetricsFilterFields.Status, st)
    })
  }

  if (filter.org) {
    filter.org.forEach((org) => {
      requestUrl.searchParams.append(MetricsFilterFields.Org, org)
    })
  }

  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Get metrics for a specific form
 * @param {string} formId
 */
export async function getMetricsForForm(formId) {
  const getJsonByType =
    /** @type {typeof getJson<{ totals: FormTotalsMetric }>} */ (getJson)

  const requestUrl = new URL(formId, metricsEndpoint)

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
 * @import { FilterCriteria } from '~/src/models/admin/metrics-helper.js'
 */
