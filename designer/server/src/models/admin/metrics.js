import {
  componentUsageFeatures,
  componentUsageFormStructures,
  componentUsageQuestionTypes,
  mapOverviewMetrics,
  mapTotalMetrics
} from '~/src/models/admin/metrics-helper.js'

const tilePeriodNames = {
  last7Days: {
    ariaPeriodName: 'previous 7 days',
    straplinePeriodName: 'last week'
  },
  last30Days: {
    ariaPeriodName: 'previous 30 days',
    straplinePeriodName: 'last month'
  },
  allTime: {
    ariaPeriodName: 'previous year',
    straplinePeriodName: 'last year'
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function metricsFormActivityViewModel(metrics) {
  // Sort forms by name then status
  const overviewsSorted = metrics.overview.toSorted((a, b) => {
    const formNameA = /** @type {string} */ (a.summaryMetrics.name)
    const formNameB = /** @type {string} */ (b.summaryMetrics.name)
    return `${formNameA}${a.formStatus}`.localeCompare(
      `${formNameB}${b.formStatus}`
    )
  })

  // Create a map of submission counts per form for quicker lookups
  const formSubmissionCounts = new Map()
  for (const [formId, count] of Object.entries(
    metrics.totals.submissions ?? {}
  )) {
    formSubmissionCounts.set(formId, count)
  }

  return {
    overviewMetrics: mapTotalMetrics(metrics.totals, tilePeriodNames),
    formMetricRows: mapOverviewMetrics(overviewsSorted, formSubmissionCounts)
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function metricsComponentUsageViewModel(metrics) {
  return {
    formUsageQuestionTypes: componentUsageQuestionTypes(metrics),
    formUsageFeatures: componentUsageFeatures(metrics),
    formUsageFormStructures: componentUsageFormStructures(metrics)
  }
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
