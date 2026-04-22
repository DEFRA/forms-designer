import { FormMetricName } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

const FULL_DATE_MASK = 'd MMMM yyyy'

/**
 * @param {string} changeSymbol - '+' or '-' or ''
 * @param {number} changeValue
 * @param {string} changePercentage
 * @param {string} periodPhrase
 */
export function buildAriaLabel(
  changeSymbol,
  changeValue,
  changePercentage,
  periodPhrase
) {
  let directionPhrase = 'no change'
  if (changeSymbol === '+') {
    directionPhrase = `an increase of ${formatNumber(changeValue)} (${changeSymbol}${changePercentage}%)`
  } else if (changeSymbol === '-') {
    directionPhrase = `a decrease of ${formatNumber(changeValue)} (${changePercentage}%)`
  }
  return `There has been ${directionPhrase} compared to the ${periodPhrase}`
}

/**
 * @param {Record<FormMetricName, { count?: number }>} currPeriod
 * @param {Record<FormMetricName, { count?: number }>} prevPeriod
 * @param {FormMetricName} metricName
 * @param {string} ariaPeriodName
 * @param {string} straplinePeriodName
 */
export function collateSpecificTileCounts(
  currPeriod,
  prevPeriod,
  metricName,
  ariaPeriodName,
  straplinePeriodName
) {
  const currPeriodCount =
    metricName in currPeriod ? (currPeriod[metricName].count ?? 0) : 0
  const prevPeriodCount =
    metricName in prevPeriod ? (prevPeriod[metricName].count ?? 0) : 0
  const counts = {
    count: currPeriodCount,
    changeSymbol:
      currPeriodCount === prevPeriodCount
        ? ''
        : currPeriodCount > prevPeriodCount
          ? '+'
          : '-',
    changeValue: currPeriodCount - prevPeriodCount,
    changePercentage: (
      ((currPeriodCount - prevPeriodCount) / prevPeriodCount) *
      100
    ).toFixed(1)
  }

  let changePhrase = 'No difference in'
  if (counts.changeSymbol === '+') {
    changePhrase = `${counts.changeValue} more`
  } else if (counts.changeSymbol === '-') {
    changePhrase = `${Math.abs(counts.changeValue)} fewer`
  }

  const formPlural = counts.changeValue === 1 ? '' : 's'

  return {
    ...counts,
    ariaLabel: buildAriaLabel(
      counts.changeSymbol,
      counts.changeValue,
      counts.changePercentage,
      ariaPeriodName
    ),
    strapline: `${changePhrase} form${formPlural} created than ${straplinePeriodName}`
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function metricsViewModel(metrics) {
  // Sort forms by name
  const overviewsSorted = metrics.overview.sort((a, b) => {
    const formNameA = /** @type {string} */ (a.summaryMetrics.name)
    const formNameB = /** @type {string} */ (b.summaryMetrics.name)
    return formNameA.localeCompare(formNameB)
  })

  // Create a map of submission counts per form for quicker lookups
  const formSubmissionCounts = new Map()
  for (const [formId, count] of Object.entries(metrics.totals.submissions)) {
    formSubmissionCounts.set(formId, count)
  }

  return {
    overviewMetrics: mapTotalMetrics(metrics.totals),
    formMetricRows: mapOverviewMetrics(overviewsSorted, formSubmissionCounts)
  }
}

/**
 * @param {FormOverviewMetric[]} metrics
 * @param {Map<string, number>} submissionCounts
 */
export function mapOverviewMetrics(metrics, submissionCounts) {
  return metrics.map((metric) => ({
    ...metric.summaryMetrics,
    formName: metric.summaryMetrics.name,
    features: Array.isArray(metric.summaryMetrics.features)
      ? metric.summaryMetrics.features.join(', ')
      : [],
    submissions: submissionCounts.get(metric.formId) ?? 0,
    daysToPublish: '-'
  }))
}

/**
 * @param {FormTotalsMetric} totals
 */
export function mapTotalMetrics(totals) {
  const reportMorning = startOfDay(totals.updatedAt)
  const sevenDaysAgo = subDays(reportMorning, 7)
  const thirtyDaysAgo = subDays(reportMorning, 30)

  const last7Days = {
    fromDate: format(sevenDaysAgo, FULL_DATE_MASK),
    toDate: format(reportMorning, FULL_DATE_MASK),
    title: 'Last 7 days',
    newFormsCreated: {
      title: 'New forms created',
      ...collateSpecificTileCounts(
        totals.last7Days,
        totals.prev7Days,
        FormMetricName.NewFormsCreated,
        'previous 7 days',
        'last week'
      )
    },
    formsPublished: {
      title: 'Forms published',
      ...collateSpecificTileCounts(
        totals.last7Days,
        totals.prev7Days,
        FormMetricName.FormsPublished,
        'previous 7 days',
        'last week'
      )
    },
    formSubmissions: {
      title: 'Form submissions',
      ...collateSpecificTileCounts(
        totals.last7Days,
        totals.prev7Days,
        FormMetricName.Submissions,
        'previous 7 days',
        'last week'
      )
    }
  }

  const last30Days = {
    fromDate: format(thirtyDaysAgo, FULL_DATE_MASK),
    toDate: format(reportMorning, FULL_DATE_MASK),
    title: 'Last 30 days',
    newFormsCreated: {
      title: 'New forms created',
      ...collateSpecificTileCounts(
        totals.last30Days,
        totals.prev30Days,
        FormMetricName.NewFormsCreated,
        'previous 30 days',
        'last month'
      )
    },
    formsPublished: {
      title: 'Forms published',
      ...collateSpecificTileCounts(
        totals.last7Days,
        totals.prev7Days,
        FormMetricName.FormsPublished,
        'previous 30 days',
        'last month'
      )
    },
    formSubmissions: {
      title: 'Form submissions',
      ...collateSpecificTileCounts(
        totals.last7Days,
        totals.prev7Days,
        FormMetricName.Submissions,
        'previous 30 days',
        'last month'
      )
    }
  }

  const allTime = {
    fromDate: undefined,
    toDate: undefined,
    title: 'All time',
    newFormsCreated: {
      title: 'New forms created',
      ...collateSpecificTileCounts(
        totals.allTime,
        totals.prevYear,
        FormMetricName.NewFormsCreated,
        'previous year',
        'last year'
      )
    },
    formsPublished: {
      title: 'Forms published',
      ...collateSpecificTileCounts(
        totals.allTime,
        totals.prevYear,
        FormMetricName.FormsPublished,
        'previous year',
        'last year'
      )
    },
    formSubmissions: {
      title: 'Form submissions',
      ...collateSpecificTileCounts(
        totals.allTime,
        totals.prevYear,
        FormMetricName.Submissions,
        'previous year',
        'last year'
      )
    }
  }

  return {
    last7Days,
    last30Days,
    allTime
  }
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
