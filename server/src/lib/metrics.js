import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const formMetricsEndpoint = new URL('/report/', config.auditUrl)
const functionalAreaMetricsEndpoint = new URL(
  '/report-functional-area/',
  config.auditUrl
)

export const MetricsFilterFields = {
  SearchText: 'searchText',
  Status: 'status',
  Org: 'org'
}

/**
 * Get form metrics
 * @param {FilterCriteria} [filter]
 */
export async function getFormMetrics(filter = {}) {
  const getJsonByType =
    /** @type {typeof getJson<{ overview: FormOverviewMetric[], totals: FormTotalsMetric }>} */ (
      getJson
    )

  const requestUrl = new URL(formMetricsEndpoint)

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

  if (filter.language) {
    requestUrl.searchParams.set('language', filter.language)
  }

  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Get functional area metrics
 * @param {FunctionalAreaType} area
 */
export async function getFunctionalAreaMetrics(area) {
  const getJsonByType =
    /** @type {typeof getJson<{ totals: FunctionalAreaTotalsMetric }>} */ (
      getJson
    )

  const requestUrl = new URL(area, functionalAreaMetricsEndpoint)
  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Get drilldown metrics (details within a tile)
 * @param {string} period
 * @param {FormMetricName} metricName
 * @param { string | undefined } language
 */
export async function getDrilldownMetrics(period, metricName, language) {
  const getJsonByType =
    /** @type {typeof getJson<{ drilldownRows: FormDrilldownMetric[] }>} */ (
      getJson
    )

  const languageParam = language ? `/${language}` : ''

  const requestUrl = new URL(
    `${period}/${metricName}${languageParam}`,
    formMetricsEndpoint
  )

  const { body } = await getJsonByType(requestUrl)

  return body.drilldownRows
}

/**
 * Get metrics for a specific form
 * @param {string} formId
 */
export async function getMetricsForForm(formId) {
  const getJsonByType =
    /** @type {typeof getJson<{ totals: FormTotalsMetric }>} */ (getJson)

  const requestUrl = new URL(formId, formMetricsEndpoint)

  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Get details of submissions per month, split by form
 * @param {Date} earliestDate
 */
export async function getSubmissionsPerMonth(earliestDate) {
  const getJsonByType =
    /** @type {typeof getJson<Record<string, Record<string, number>>>} */ (
      getJson
    )

  const requestUrl = new URL(`/report-submissions`, config.auditUrl)
  requestUrl.searchParams.set('earliestDate', earliestDate.toISOString())

  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Regenerate the full set of metrics afresh (clears the 'mertics' DB and repopulates)
 * @param {string} token
 */
export async function regenerateMetrics(token) {
  const requestUrl = new URL('regenerate', formMetricsEndpoint)
  await postJson(requestUrl, {
    ...getHeaders(token)
  })
}

/**
 * @import { FormDrilldownMetric, FormMetricName, FormOverviewMetric, FormTotalsMetric, FunctionalAreaTotalsMetric, FunctionalAreaType } from '@defra/forms-model'
 * @import { FilterCriteria } from '~/src/models/admin/metrics-types.js'
 */
