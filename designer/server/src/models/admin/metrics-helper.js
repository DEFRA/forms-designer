import { FormMetricName } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

const FULL_DATE_MASK = 'd MMMM yyyy'
const NEW_FORMS_CREATED_TITLE = 'New forms created'
const FORMS_PUBLISHED_TITLE = 'Forms published'
const FORM_SUBMISSIONS_TITLE = 'Form submissions'

const straplineWording = {
  [FormMetricName.NewFormsCreated]: { noun: 'form', verb: 'created' },
  [FormMetricName.FormsPublished]: { noun: 'form', verb: 'published' },
  [FormMetricName.Submissions]: { noun: 'submission', verb: '' }
}
/**
 * @typedef PeriodName
 * @property {string} ariaPeriodName - period name within aria label
 * @property {string} straplinePeriodName - period name within strapline
 */

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
    directionPhrase = `an increase of ${formatNumber(Math.abs(changeValue))} (${changeSymbol}${changePercentage}%)`
  } else if (changeSymbol === '-') {
    directionPhrase = `a decrease of ${formatNumber(Math.abs(changeValue))} (${changePercentage}%)`
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
 * @param {[string, number][]} questionTypes
 * @param {Map<string, number>} forms
 * @param {number} totalForms
 */
export function mapQuestionTypes(questionTypes, forms, totalForms) {
  return questionTypes.map((qt) => {
    const numForms = forms.get(qt[0]) ?? 0
    return {
      questionTypeName: qt[0],
      totalUsage: qt[1],
      formsUsing: numForms,
      percentage: `${((numForms / totalForms) * 100).toFixed(1)}%`
    }
  })
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function componentUsageQuestionTypes(metrics) {
  // Compute counts of each question type
  const totalForms = metrics.overview.length
  const questionTypes = /** @type {Map<string, number>} */ (new Map())
  const formsUsing = /** @type {Map<string, number>} */ (new Map())
  for (const metric of metrics.overview) {
    const typedEntries = /** @type {[string, number][]} */ (
      Object.entries(metric.featureMetrics.questionTypes)
    )
    for (const [questionType, count] of typedEntries) {
      const currenTypesCount = questionTypes.get(questionType) ?? 0
      questionTypes.set(questionType, currenTypesCount + count)
      const currenFormsCount = formsUsing.get(questionType) ?? 0
      formsUsing.set(questionType, currenFormsCount + 1)
    }
  }
  // Sort results in reverse order of counts
  const questionTypesSorted = new Map(
    [...questionTypes.entries()].sort(
      ([_aKey, aVal], [_bKey, bVal]) => bVal - aVal
    )
  )

  return mapQuestionTypes(
    Array.from(questionTypesSorted),
    formsUsing,
    totalForms
  )
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function componentUsageFeatures(metrics) {
  // Compute counts of each feature type
  const totalForms = metrics.overview.length
  const formsUsing = /** @type {Map<string, number>} */ (new Map())
  for (const metric of metrics.overview) {
    const typedEntries = /** @type {[string, number][]} */ (
      Object.entries(metric.featureMetrics.features)
    )
    for (const [featureName] of typedEntries) {
      const currenFormsCount = formsUsing.get(featureName) ?? 0
      formsUsing.set(featureName, currenFormsCount + 1)
    }
  }
  // Sort results in reverse order of counts
  const featuresSorted = new Map(
    [...formsUsing.entries()].sort(
      ([_aKey, aVal], [_bKey, bVal]) => bVal - aVal
    )
  )

  return Array.from(featuresSorted).map((f) => ({
    featureName: f[0],
    formsUsing: f[1],
    percentage: `${((f[1] / totalForms) * 100).toFixed(1)}%`
  }))
}

/**
 * @param {string} metricName
 */
function mapFormStructureName(metricName) {
  if (metricName === 'questionTypes') {
    return 'Question types per form'
  }
  return `${metricName.substring(0, 1).toUpperCase()}${metricName.substring(1)} per form`
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function componentUsageFormStructures(metrics) {
  // Compute min/max/avg of each feature type
  const totalForms = metrics.overview.length
  const structureStats =
    /** @type {Map<string, { min: number, max: number, total: number, avg: number }>} */ (
      new Map()
    )
  for (const metric of metrics.overview) {
    const typedEntries = /** @type {[string, number][]} */ (
      Object.entries(metric.featureMetrics.formStructure)
    )
    for (const [metricName, count] of typedEntries) {
      const statsSoFar = structureStats.get(metricName) ?? {
        min: 9999,
        max: 0,
        total: 0
      }
      const newStats = {
        min: Math.min(count, statsSoFar.min),
        max: Math.max(count, statsSoFar.max),
        total: statsSoFar.total + count,
        avg: (statsSoFar.total + count) / totalForms
      }
      structureStats.set(metricName, newStats)
    }
  }

  return Array.from(structureStats).map((f) => ({
    metricName: mapFormStructureName(f[0]),
    average: f[1].avg.toFixed(1),
    minimum: f[1].min,
    maximum: f[1].max
  }))
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
 * @param {number} currCount
 * @param {number} prevCount
 */
function calcChangePercentage(currCount, prevCount) {
  if (currCount === 0 && prevCount === 0) {
    return '-'
  }
  if (prevCount === 0) {
    return '100'
  }
  return (((currCount - prevCount) / prevCount) * 100).toFixed(1)
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
    changePercentage: calcChangePercentage(currPeriodCount, prevPeriodCount)
  }

  const changePhrase = buildChangePhrase(counts)

  const nounPlural = counts.changeValue === 1 ? '' : 's'

  const { noun, verb } = straplineWording[metricName]

  return {
    ...counts,
    ariaLabel: buildAriaLabel(
      counts.changeSymbol,
      counts.changeValue,
      counts.changePercentage,
      periodNames.ariaPeriodName
    ),
    strapline: `${changePhrase} ${noun}${nounPlural} ${verb} than ${periodNames.straplinePeriodName}`
  }
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
 * @param {{ last7Days: PeriodName, last30Days: PeriodName, allTime: PeriodName }} tilePeriodNames
 */
export function mapTotalMetrics(totals, tilePeriodNames) {
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
