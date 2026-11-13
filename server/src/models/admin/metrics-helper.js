import { FormMetricName, FormStatus } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'
import {
  ALL_TIME_TEXT,
  FORMS_FIRST_PUBLISHED_TITLE,
  FORMS_IN_DRAFT_TITLE,
  FORMS_REPUBLISHED_TITLE,
  FORM_SUBMISSIONS_TITLE,
  FULL_DATE_MASK,
  LAST_30_DAYS_TEXT,
  LAST_7_DAYS_TEXT,
  NEW_FORMS_CREATED_TITLE,
  SEVEN_DAYS,
  THIRTY_DAYS,
  TIME_TO_PUBLISH_TITLE
} from '~/src/models/admin/metrics-constants.js'
import { MetricsTileConfig } from '~/src/models/admin/metrics-tile-config.js'

const formStructureMetricNames =
  /** @type {Partial<Record<string, string>>} */ ({
    pages: 'Pages per form',
    questions: 'Questions per form',
    sections: 'Sections per form',
    conditions: 'Conditions per form',
    questionTypes: 'Question types per form'
  })

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
 * @param { Partial<Record<FormMetricName | FunctionalAreaMetricName, { count?: number }>> | undefined } currPeriod
 * @param { Partial<Record<FormMetricName | FunctionalAreaMetricName, { count?: number }>> | undefined } prevPeriod
 * @param { FormMetricName | FunctionalAreaMetricName } metricName
 * @param {PeriodName} periodNames
 * @param { string | undefined } language
 * @param { string | undefined } [units]
 */
export function collateSpecificTileCounts(
  currPeriod,
  prevPeriod,
  metricName,
  periodNames,
  language,
  units
) {
  const currPeriodCount =
    currPeriod && metricName in currPeriod
      ? (currPeriod[metricName]?.count ?? 0)
      : 0
  const prevPeriodCount =
    prevPeriod && metricName in prevPeriod
      ? (prevPeriod[metricName]?.count ?? 0)
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

  const languageParam = language ? `/${language}` : ''

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
        ? `/admin/form-metrics/drilldown/${periodNames.slug}/${metricName}${languageParam}`
        : ''
    },
    classes: ''
  }
}

/**
 * @param {string} title
 * @param { FormMetricName | FunctionalAreaMetricName } metricName
 * @param {{ currPeriod: Partial<Record<FormMetricName | FunctionalAreaMetricName, { count?: number }>> | undefined, prevPeriod: Partial<Record<FormMetricName | FunctionalAreaMetricName, { count?: number }>> | undefined, periodNames: PeriodName, language: string | undefined, classes?: string }} commonParams
 * @param {string} [units]
 */
export function createTile(title, metricName, commonParams, units) {
  return /** @type {MetricsTile} */ ({
    title,
    ...collateSpecificTileCounts(
      commonParams.currPeriod,
      commonParams.prevPeriod,
      metricName,
      commonParams.periodNames,
      commonParams.language,
      units
    ),
    ...(commonParams.classes ? { classes: commonParams.classes } : {})
  })
}

/**
 * @param {{ fromDate: Date | undefined, toDate: Date | undefined }} dateRange
 * @param {string} title
 * @param { Record<FormMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FormMetricName, { count?: number }> | undefined } prevPeriod
 * @param {PeriodName} periodNames
 * @param { string | undefined } language
 */
export function mapOverviewTiles(
  dateRange,
  title,
  currPeriod,
  prevPeriod,
  periodNames,
  language
) {
  const commonParams = {
    currPeriod,
    prevPeriod,
    periodNames,
    language
  }
  return /** @type {FormTilesView} */ ({
    fromDate: dateRange.fromDate
      ? format(dateRange.fromDate, FULL_DATE_MASK)
      : undefined,
    toDate: dateRange.toDate
      ? format(dateRange.toDate, FULL_DATE_MASK)
      : undefined,
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
 * @param { string | undefined } language
 */
export function mapTotalMetrics(totals, tilePeriodNames, language) {
  const reportMorning = startOfDay(totals.updatedAt)
  const sevenDaysAgo = subDays(reportMorning, SEVEN_DAYS)
  const thirtyDaysAgo = subDays(reportMorning, THIRTY_DAYS)

  const last7Days = mapOverviewTiles(
    { fromDate: sevenDaysAgo, toDate: reportMorning },
    LAST_7_DAYS_TEXT,
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days,
    language
  )

  const last30Days = mapOverviewTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    LAST_30_DAYS_TEXT,
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days,
    language
  )

  const allTime = mapOverviewTiles(
    { fromDate: totals.earliestDate, toDate: reportMorning },
    ALL_TIME_TEXT,
    totals.allTime,
    totals.prevYear,
    tilePeriodNames.allTime,
    language
  )

  return /** @type {{ last7Days: FormTilesView, last30Days: FormTilesView, allTime: FormTilesView }} */ ({
    last7Days,
    last30Days,
    allTime
  })
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric, FunctionalAreaMetricName } from '@defra/forms-model'
 * @import { ComponentUsageFeature, ComponentUsageFormStructure, ComponentUsageQuestionType, FormTilesView, MetricsTile, PeriodName, TableRowMetric } from '~/src/models/admin/metrics-types.js'
 */
