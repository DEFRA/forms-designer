import { FormMetricName } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

const FULL_DATE_MASK = 'd MMMM yyyy'
const NEW_FORMS_CREATED_TITLE = 'New forms created'
const FORMS_PUBLISHED_TITLE = 'Forms published'
const FORM_SUBMISSIONS_TITLE = 'Form submissions'

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
  let directionPhrase = ''
  if (changeSymbol === '+') {
    directionPhrase = `an increase of ${formatNumber(changeValue)} (${changeSymbol}${changePercentage}%)`
  } else if (changeSymbol === '-') {
    directionPhrase = `a decrease of ${formatNumber(changeValue)} (${changePercentage}%)`
  } else {
    directionPhrase = 'no change'
  }
  return `There has been ${directionPhrase} compared to the ${periodPhrase}`
}

/**
 * @param {{ changeSymbol: string, changeValue: number }} counts
 */
export function buildChangePhrase(counts) {
  if (counts.changeSymbol === '+') {
    return `${counts.changeValue} more`
  } else if (counts.changeSymbol === '-') {
    return `${Math.abs(counts.changeValue)} fewer`
  } else {
    return 'No difference in'
  }
}

/**
 * @param { Record<FormMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FormMetricName, { count?: number }> | undefined } prevPeriod
 * @param {FormMetricName} metricName
 * @param {{ ariaPeriodName: string, straplinePeriodName: string }} periodNames
 */
export function collateSpecificTileCounts(
  currPeriod,
  prevPeriod,
  metricName,
  periodNames
) {
  const currPeriodCount =
    currPeriod && metricName in currPeriod
      ? (currPeriod[metricName].count ?? 0)
      : 0
  const prevPeriodCount =
    prevPeriod && metricName in prevPeriod
      ? (prevPeriod[metricName].count ?? 0)
      : 0

  const notEqualSymbol = currPeriodCount > prevPeriodCount ? '+' : '-'
  const counts = {
    count: currPeriodCount,
    changeSymbol: currPeriodCount === prevPeriodCount ? '' : notEqualSymbol,
    changeValue: currPeriodCount - prevPeriodCount,
    changePercentage: (
      ((currPeriodCount - prevPeriodCount) / prevPeriodCount) *
      100
    ).toFixed(1)
  }

  const changePhrase = buildChangePhrase(counts)

  const formPlural = counts.changeValue === 1 ? '' : 's'

  return {
    ...counts,
    ariaLabel: buildAriaLabel(
      counts.changeSymbol,
      counts.changeValue,
      counts.changePercentage,
      periodNames.ariaPeriodName
    ),
    strapline: `${changePhrase} form${formPlural} created than ${periodNames.straplinePeriodName}`
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function metricsViewModel(metrics) {
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
 * @param { Date | undefined } fromDate
 * @param { Date | undefined } toDate
 * @param {string} title
 * @param { Record<FormMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FormMetricName, { count?: number }> | undefined } prevPeriod
 * @param {{ ariaPeriodName: string, straplinePeriodName: string }} periodNames
 */
export function mapOverviewTiles(
  fromDate,
  toDate,
  title,
  currPeriod,
  prevPeriod,
  periodNames
) {
  return {
    fromDate: fromDate ? format(fromDate, FULL_DATE_MASK) : undefined,
    toDate: toDate ? format(toDate, FULL_DATE_MASK) : undefined,
    title,
    newFormsCreated: {
      title: NEW_FORMS_CREATED_TITLE,
      ...collateSpecificTileCounts(
        currPeriod,
        prevPeriod,
        FormMetricName.NewFormsCreated,
        periodNames
      )
    },
    formsPublished: {
      title: FORMS_PUBLISHED_TITLE,
      ...collateSpecificTileCounts(
        currPeriod,
        prevPeriod,
        FormMetricName.FormsPublished,
        periodNames
      )
    },
    formSubmissions: {
      title: FORM_SUBMISSIONS_TITLE,
      ...collateSpecificTileCounts(
        currPeriod,
        prevPeriod,
        FormMetricName.Submissions,
        periodNames
      )
    }
  }
}

/**
 * @param {FormTotalsMetric} totals
 */
export function mapTotalMetrics(totals) {
  const reportMorning = startOfDay(totals.updatedAt)
  const sevenDaysAgo = subDays(reportMorning, 7)
  const thirtyDaysAgo = subDays(reportMorning, 30)

  const last7Days = mapOverviewTiles(
    sevenDaysAgo,
    reportMorning,
    'Last 7 days',
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days
  )

  const last30Days = mapOverviewTiles(
    thirtyDaysAgo,
    reportMorning,
    'Last 30 days',
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days
  )

  const allTime = mapOverviewTiles(
    undefined,
    undefined,
    'All time',
    totals.allTime,
    totals.prevYear,
    tilePeriodNames.allTime
  )

  return {
    last7Days,
    last30Days,
    allTime
  }
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 */
