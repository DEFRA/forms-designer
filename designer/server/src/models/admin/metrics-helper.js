import { FormMetricName, FormStatus } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

const FULL_DATE_MASK = 'd MMMM yyyy'
const NEW_FORMS_CREATED_TITLE = 'New forms created'
const FORMS_FIRST_PUBLISHED_TITLE = 'Forms first published'
const FORMS_REPUBLISHED_TITLE = 'Form re-published'
const FORM_SUBMISSIONS_TITLE = 'Form submissions'
const FORMS_IN_DRAFT_TITLE = 'Forms in draft'
const TIME_TO_PUBLISH_TITLE = 'Average time to publish'

/**
 * @typedef {object} FilterCriteria
 * @property {string} [searchText] - text to look for
 * @property {string[]} [status] - allowable statuses
 * @property {string[]} [org] - list of organisations
 */

/**
 * @typedef {object} SortCriteria
 * @property {string} [sortCol] - column name to sort
 * @property {string} [sortDir] - direction of sort (asc/desc)
 */

/**
 * @typedef {FilterCriteria & SortCriteria & { action?: string, showFilter?: string }} FilterAndSortCriteria
 */

/**
 * @typedef {object} TableRowMetric
 * @property {string} formName - name of the form
 * @property {string} features - list of features
 * @property {number} submissions - count of submissions
 * @property {number | string} daysToPublish - number of days from draft to live
 * @property {number | string} republished - number of times the form has been re-published
 */

/**
 * @typedef {object} MetricsTile
 * @property {string} title - title for the tile
 * @property {string} ariaLabel - text for aria label
 * @property {string} strapline - strapline text
 * @property {TileDrillDown} drillDown - drilldown config
 */

/**
 * @typedef {object} FormTilesView
 * @property { string | undefined } fromDate - name of the form
 * @property { string | undefined } toDate - list of features
 * @property {string} title - title for section
 * @property {Record<FormMetricName, MetricsTile>} tiles - tiles to be displayed
 */

/**
 * @typedef {object} ComponentUsageQuestionType
 * @property {string} questionTypeName - name of question type
 * @property {number} totalUsage - total number of times this question type is used
 * @property {number} formsUsing - total number of forms that use this question type
 * @property {string} percentage - percentage 'number of forms using' / 'total number of forms'
 */

/**
 * @typedef {object} ComponentUsageFeature
 * @property {string} featureName - name of feature
 * @property {number} formsUsing - total number of forms that use this feature
 * @property {string} percentage - percentage 'number of forms using' / 'total number of forms'
 */

/**
 * @typedef {object} ComponentUsageFormStructure
 * @property {string} metricName - name of metric
 * @property {string} average - average value across all forms
 * @property {number} minimum - minimum number across all forms
 * @property {number} maximum - maximum number across all forms
 */

const formStructureMetricNames =
  /** @type {Partial<Record<string, string>>} */ ({
    pages: 'Pages per form',
    questions: 'Questions per form',
    sections: 'Sections per form',
    conditions: 'Conditions per form',
    questionTypes: 'Question types per form'
  })

/**
 * @typedef {object} TileDrillDownConfig
 * @property {boolean} enabled - true if drill down is allowed
 * @property {boolean} grouped - true if drill down results are to be grouped per form
 * @property {string} displayName - display name for metric
 * @property {{ text: string, attributes?: Record<string, string> }} [headers] - custom headers for drill down
 * @property {(detail: FormTimelineMetric) => { text: string, attributes?: Record<string, string | number> }} [valueFunc] - function to return custom value
 */

/**
 * @typedef {object} TileDrillDown
 * @property {boolean} enabled - true if drill down is allowed
 * @property {string} url - the path for the drilldown operation
 */

/**
 * @typedef {object} MetricTileConfigRecordType
 * @property {string} noun - noun used in tile phrase structure
 * @property {string} verb - verb used in tile phrase structure
 * @property {TileDrillDownConfig} drillDown - config for drill down operations
 */

export const MetricsTileConfig =
  /** @type {Record<FormMetricName, MetricTileConfigRecordType>} */ ({
    [FormMetricName.NewFormsCreated]: {
      noun: 'form',
      verb: 'created',
      drillDown: {
        displayName: 'new forms created',
        enabled: true,
        grouped: false,
        headers: { text: 'Created date', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => dateCell(detail.createdAt)
      }
    },
    [FormMetricName.FormsFirstPublished]: {
      noun: 'form',
      verb: 'first published',
      drillDown: {
        displayName: 'forms first published',
        enabled: true,
        grouped: false,
        headers: {
          text: 'First published date',
          attributes: { 'aria-sort': 'none' }
        },
        valueFunc: (detail) => dateCell(detail.createdAt)
      }
    },
    [FormMetricName.FormsRePublished]: {
      noun: '',
      verb: 're-published',
      drillDown: {
        displayName: 're-published',
        enabled: true,
        grouped: true,
        headers: { text: 'Re-published', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => numberCell(detail.metricValue)
      }
    },
    [FormMetricName.Submissions]: {
      noun: 'submission',
      verb: '',
      drillDown: {
        displayName: 'submissions',
        enabled: true,
        grouped: true,
        headers: { text: 'Submissions', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => numberCell(detail.metricValue)
      }
    },
    [FormMetricName.FormsInDraft]: {
      noun: 'form',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [FormMetricName.TimeToPublish]: {
      noun: 'day',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    }
  })

/**
 * @typedef PeriodName
 * @property {string} ariaPeriodName - period name within aria label
 * @property {string} straplinePeriodName - period name within strapline
 * @property {string} slug - part of url used for drilldown navigation
 */

/**
 * @param {string} changeSymbol - '+' or '-' or ''
 * @param {number} changeValue
 * @param {number} changePercentage
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
    return /** @type {ComponentUsageQuestionType} */ ({
      questionTypeName: qt[0],
      totalUsage: qt[1],
      formsUsing: numForms,
      percentage: `${((numForms / totalForms) * 100).toFixed(1)}%`
    })
  })
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FormStatus} formStatus
 */
export function componentUsageQuestionTypes(metrics, formStatus) {
  // Compute counts of each question type
  const filtered = metrics.overview.filter((ov) => ov.formStatus === formStatus)
  const totalForms = filtered.length
  const questionTypes = /** @type {Map<string, number>} */ (new Map())
  const formsUsing = /** @type {Map<string, number>} */ (new Map())
  for (const metric of filtered) {
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
 * @param {FormStatus} formStatus
 */
export function componentUsageFeatures(metrics, formStatus) {
  // Compute counts of each feature type
  const filtered = metrics.overview.filter((ov) => ov.formStatus === formStatus)
  const totalForms = filtered.length
  const formsUsing = /** @type {Map<string, number>} */ (new Map())
  for (const metric of filtered) {
    const typedEntries = /** @type {[string, number][]} */ (
      Object.entries(metric.featureMetrics.features)
    )
    for (const [featureName] of typedEntries) {
      const currenFormsCount = formsUsing.get(featureName) ?? 0
      formsUsing.set(featureName, currenFormsCount + 1)
    }
  }
  // Sort results in reverse order of counts
  return [...formsUsing.entries()]
    .sort(([_aKey, aVal], [_bKey, bVal]) => bVal - aVal)
    .map(
      (f) =>
        /** @type {ComponentUsageFeature} */ ({
          featureName: f[0],
          formsUsing: f[1],
          percentage: `${((f[1] / totalForms) * 100).toFixed(1)}%`
        })
    )
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FormStatus} formStatus
 */
export function componentUsageFormStructures(metrics, formStatus) {
  // Compute min/max/avg of each feature type
  const filtered = metrics.overview.filter((ov) => ov.formStatus === formStatus)
  const totalForms = filtered.length
  const structureStats =
    /** @type {Map<string, { min: number, max: number, total: number, avg: number }>} */ (
      new Map()
    )
  for (const metric of filtered) {
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

  return Array.from(structureStats).map(
    (f) =>
      /** @type {ComponentUsageFormStructure} */ ({
        metricName: formStructureMetricNames[f[0]] ?? 'Unknown',
        average: f[1].avg.toFixed(1),
        minimum: f[1].min,
        maximum: f[1].max
      })
  )
}

/**
 * @param {FormOverviewMetric[]} metrics
 * @returns {TableRowMetric[]}
 */
export function mapOverviewMetrics(metrics) {
  return metrics.map(
    (metric) =>
      /** @type {TableRowMetric} */ ({
        ...metric.summaryMetrics,
        formName: /** @type {string} */ (metric.summaryMetrics.name),
        features: Array.isArray(metric.summaryMetrics.features)
          ? metric.summaryMetrics.features.join(', ')
          : '',
        submissions: metric.submissionsCount,
        daysToPublish:
          metric.formStatus === FormStatus.Live
            ? /** @type {number} */ (metric.summaryMetrics.daysToPublish)
            : '-',
        republished:
          metric.formStatus === FormStatus.Live
            ? /** @type {number} */ (metric.summaryMetrics.republished)
            : '-'
      })
  )
}

/**
 * @param {number} currCount
 * @param {number} prevCount
 * @returns {number}
 */
export function calcChangePercentage(currCount, prevCount) {
  if (currCount === 0 && prevCount === 0) {
    return 0
  }
  if (prevCount === 0) {
    return 100
  }
  return oneDecimalPlace(((currCount - prevCount) / prevCount) * 100)
}

/**
 * @param {number} num
 */
export function oneDecimalPlace(num) {
  return Number.parseFloat(num.toFixed(1))
}

/**
 * @param { Record<FormMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FormMetricName, { count?: number }> | undefined } prevPeriod
 * @param {FormMetricName} metricName
 * @param {PeriodName} periodNames
 * @param { string | undefined } [units]
 */
export function collateSpecificTileCounts(
  currPeriod,
  prevPeriod,
  metricName,
  periodNames,
  units
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
  const counts =
    /** @type {{ count: number, changeSymbol: string, changeValue: number, changePercentage: number, units?: string }} */ ({
      count: oneDecimalPlace(currPeriodCount),
      changeSymbol: currPeriodCount === prevPeriodCount ? '' : notEqualSymbol,
      changeValue: oneDecimalPlace(currPeriodCount - prevPeriodCount),
      changePercentage: calcChangePercentage(currPeriodCount, prevPeriodCount)
    })
  if (units) {
    counts.units = units
  }

  const changePhrase = buildChangePhrase(counts)

  const nounPlural = counts.changeValue === 1 ? '' : 's'

  const { noun, verb, drillDown } = MetricsTileConfig[metricName]

  const nounCombined = noun ? `${noun}${nounPlural}` : ''

  return {
    ...counts,
    ariaLabel: buildAriaLabel(
      counts.changeSymbol,
      counts.changeValue,
      counts.changePercentage,
      periodNames.ariaPeriodName
    ),
    strapline: `${changePhrase} ${nounCombined} ${verb} than ${periodNames.straplinePeriodName}`,
    drillDown: {
      enabled: drillDown.enabled,
      url: drillDown.enabled
        ? `/admin/form-metrics/drilldown/${periodNames.slug}/${metricName}`
        : ''
    },
    classes: ''
  }
}

/**
 * @param {string} title
 * @param {FormMetricName} metricName
 * @param {{ currPeriod: Record<FormMetricName, { count?: number }> | undefined, prevPeriod: Record<FormMetricName, { count?: number }> | undefined, periodNames: PeriodName }} commonParams
 * @param {string} [units]
 */
function createTile(title, metricName, commonParams, units) {
  return /** @type {MetricsTile} */ ({
    title,
    ...collateSpecificTileCounts(
      commonParams.currPeriod,
      commonParams.prevPeriod,
      metricName,
      commonParams.periodNames,
      units
    )
  })
}

/**
 * @param { Date | undefined } fromDate
 * @param { Date | undefined } toDate
 * @param {string} title
 * @param { Record<FormMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FormMetricName, { count?: number }> | undefined } prevPeriod
 * @param {PeriodName} periodNames
 */
export function mapOverviewTiles(
  fromDate,
  toDate,
  title,
  currPeriod,
  prevPeriod,
  periodNames
) {
  const commonParams = {
    currPeriod,
    prevPeriod,
    periodNames
  }
  return /** @type {FormTilesView} */ ({
    fromDate: fromDate ? format(fromDate, FULL_DATE_MASK) : undefined,
    toDate: toDate ? format(toDate, FULL_DATE_MASK) : undefined,
    title,
    tiles: {
      [FormMetricName.NewFormsCreated]: createTile(
        NEW_FORMS_CREATED_TITLE,
        FormMetricName.NewFormsCreated,
        commonParams
      ),
      [FormMetricName.FormsFirstPublished]: createTile(
        FORMS_FIRST_PUBLISHED_TITLE,
        FormMetricName.FormsFirstPublished,
        commonParams
      ),
      [FormMetricName.FormsRePublished]: createTile(
        FORMS_REPUBLISHED_TITLE,
        FormMetricName.FormsRePublished,
        commonParams
      ),
      [FormMetricName.Submissions]: createTile(
        FORM_SUBMISSIONS_TITLE,
        FormMetricName.Submissions,
        commonParams
      ),
      [FormMetricName.FormsInDraft]: createTile(
        FORMS_IN_DRAFT_TITLE,
        FormMetricName.FormsInDraft,
        commonParams
      ),
      [FormMetricName.TimeToPublish]: createTile(
        TIME_TO_PUBLISH_TITLE,
        FormMetricName.TimeToPublish,
        commonParams,
        'days'
      )
    }
  })
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
    totals.earliestDate,
    reportMorning,
    'All time',
    totals.allTime,
    totals.prevYear,
    tilePeriodNames.allTime
  )

  return /** @type {{ last7Days: FormTilesView, last30Days: FormTilesView, allTime: FormTilesView }} */ ({
    last7Days,
    last30Days,
    allTime
  })
}

/**
 * @param { string | Date } dateString
 */
export function dateCell(dateString) {
  const date = new Date(dateString)
  return {
    text: format(date, 'dd MMM yyyy h:mm aaa'),
    attributes: {
      'data-sort-value': format(date, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}

/**
 * @param {number} num
 */
export function numberCell(num) {
  return {
    text: formatNumber(num),
    attributes: {
      'data-sort-value': num
    }
  }
}

/**
 * @import { FormOverviewMetric, FormTimelineMetric, FormTotalsMetric } from '@defra/forms-model'
 */
