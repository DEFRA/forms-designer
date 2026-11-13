import {
  CopyAnswersMetricName,
  FormMetricName,
  FormStatus,
  SigninMetricName
} from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'
import { MetricsTileConfig } from '~/src/models/admin/metrics-tile-config.js'

const FULL_DATE_MASK = 'd MMMM yyyy'
const NEW_FORMS_CREATED_TITLE = 'New forms created'
const FORMS_FIRST_PUBLISHED_TITLE = 'Forms first published'
const FORMS_REPUBLISHED_TITLE = 'Form re-published'
const FORM_SUBMISSIONS_TITLE = 'Form submissions'
const FORMS_IN_DRAFT_TITLE = 'Forms in draft'
const TIME_TO_PUBLISH_TITLE = 'Average time to publish'

const REGISTRATIONS_TITLE = 'Total registrations'
const SUCCESSFUL_AUTHENTICATIONS_TITLE = 'Successful authentications'
const INCORRECT_CODE_ENTERED_TITLE = 'Incorrect codes entered'
const TOO_MANY_CODE_REQUESTS_TITLE = 'Too many code requests'
const ACCOUNT_DELETIONS_TITLE = 'Account deletions'
const EMAIL_ADDRESS_UPDATES_TITLE = 'Email address updates'
const PHONE_NUMBER_UPDATES_TITLE = 'Phone number updates'

const COPY_ANSWERS_FORMS_TITLE = 'Forms with copy answers enabled'
const COPY_ANSWERS_SUBMISSIONS_TITLE = 'Submissions using copy answers'

const SEVEN_DAYS = 7
const THIRTY_DAYS = 30

/**
 * @typedef {object} FilterCriteria
 * @property {string} [searchText] - text to look for
 * @property {string[]} [status] - allowable statuses
 * @property {string[]} [org] - list of organisations
 * @property {string} [language] - only process records for the specified language
 * @property {string} [activityType] - radio option for whether to show all forms, or forms with a Welsh translation
 */

/**
 * @typedef {object} SortCriteria
 * @property {string} [sortCol] - column name to sort
 * @property {string} [sortDir] - direction of sort (asc/desc)
 */

/**
 * @typedef {FilterCriteria & SortCriteria & { action?: string, showFilter?: string, restoreFilter?: string, currentTab?: string }} FilterAndSortCriteria
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
 * @property {string} classes - custom classes
 * @property {TileDrillDown} drillDown - drilldown config
 */

/**
 * @typedef {object} FormTilesView
 * @property { string | undefined } fromDate - name of the form
 * @property { string | undefined } toDate - list of features
 * @property {string} title - title for section
 * @property {Record<FormMetricName | FunctionalAreaMetricName, MetricsTile>} tiles - tiles to be displayed
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
 * @typedef {object} TileDrillDown
 * @property {boolean} enabled - true if drill down is allowed
 * @property {string} url - the path for the drilldown operation
 */

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
function createTile(title, metricName, commonParams, units) {
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
    'Last 7 days',
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days,
    language
  )

  const last30Days = mapOverviewTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    'Last 30 days',
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days,
    language
  )

  const allTime = mapOverviewTiles(
    { fromDate: totals.earliestDate, toDate: reportMorning },
    'All time',
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
 * @param {FunctionalAreaTotalsMetric} totals
 * @param {{ last7Days: PeriodName, last30Days: PeriodName, allTime: PeriodName }} tilePeriodNames
 */
export function mapSigninMetrics(totals, tilePeriodNames) {
  const reportMorning = startOfDay(totals.updatedAt)
  const sevenDaysAgo = subDays(reportMorning, SEVEN_DAYS)
  const thirtyDaysAgo = subDays(reportMorning, THIRTY_DAYS)

  const last7Days = mapSigninTiles(
    { fromDate: sevenDaysAgo, toDate: reportMorning },
    'Last 7 days',
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days
  )

  const last30Days = mapSigninTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    'Last 30 days',
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days
  )

  const allTime = mapSigninTiles(
    { fromDate: totals.earliestDate, toDate: reportMorning },
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
 * @param {FunctionalAreaTotalsMetric} totals
 * @param {{ last7Days: PeriodName, last30Days: PeriodName, allTime: PeriodName }} tilePeriodNames
 */
export function mapCopyAnswersMetrics(totals, tilePeriodNames) {
  const reportMorning = startOfDay(totals.updatedAt)
  const sevenDaysAgo = subDays(reportMorning, SEVEN_DAYS)
  const thirtyDaysAgo = subDays(reportMorning, THIRTY_DAYS)

  const last7Days = mapCopyAnswersTiles(
    { fromDate: sevenDaysAgo, toDate: reportMorning },
    'Last 7 days',
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days
  )

  const last30Days = mapCopyAnswersTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    'Last 30 days',
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days
  )

  const allTime = mapCopyAnswersTiles(
    { fromDate: totals.earliestDate, toDate: reportMorning },
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
 * @param {{ overview?: FormOverviewMetric[], totals: FunctionalAreaTotalsMetric }} metrics
 * @returns {TableRowMetric[]}
 */
export function mapCopyAnswersFormRows(metrics) {
  return (metrics.overview ?? []).map(
    (metric) =>
      /** @type {TableRowMetric} */ ({
        ...metric.summaryMetrics,
        formName: /** @type {string} */ (metric.summaryMetrics.name),
        submissions: metric.submissionsCount
      })
  )
}

/**
 * @param {{ fromDate: Date | undefined, toDate: Date | undefined }} dateRange
 * @param {string} title
 * @param { Record<FunctionalAreaMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FunctionalAreaMetricName, { count?: number }> | undefined } prevPeriod
 * @param {PeriodName} periodNames
 */
export function mapSigninTiles(
  dateRange,
  title,
  currPeriod,
  prevPeriod,
  periodNames
) {
  const commonParams = {
    currPeriod,
    prevPeriod,
    periodNames,
    classes: 'govuk-grid-column-one-half',
    language: undefined
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
      [SigninMetricName.Registration]: createTile(
        REGISTRATIONS_TITLE,
        SigninMetricName.Registration,
        commonParams
      ),
      [SigninMetricName.SuccessfulAuthentication]: createTile(
        SUCCESSFUL_AUTHENTICATIONS_TITLE,
        SigninMetricName.SuccessfulAuthentication,
        commonParams
      ),
      [SigninMetricName.TooManyCodeRequests]: createTile(
        TOO_MANY_CODE_REQUESTS_TITLE,
        SigninMetricName.TooManyCodeRequests,
        commonParams
      ),
      [SigninMetricName.IncorrectCodeEntered]: createTile(
        INCORRECT_CODE_ENTERED_TITLE,
        SigninMetricName.IncorrectCodeEntered,
        commonParams
      ),
      [SigninMetricName.AccountDeletion]: createTile(
        ACCOUNT_DELETIONS_TITLE,
        SigninMetricName.AccountDeletion,
        commonParams
      ),
      [SigninMetricName.EmailAddressUpdate]: createTile(
        EMAIL_ADDRESS_UPDATES_TITLE,
        SigninMetricName.EmailAddressUpdate,
        commonParams
      ),
      [SigninMetricName.PhoneNumberUpdate]: createTile(
        PHONE_NUMBER_UPDATES_TITLE,
        SigninMetricName.PhoneNumberUpdate,
        commonParams
      )
    }
  })
}

/**
 * @param {{ fromDate: Date | undefined, toDate: Date | undefined }} dateRange
 * @param {string} title
 * @param { Record<FunctionalAreaMetricName, { count?: number }> | undefined } currPeriod
 * @param { Record<FunctionalAreaMetricName, { count?: number }> | undefined } prevPeriod
 * @param {PeriodName} periodNames
 */
export function mapCopyAnswersTiles(
  dateRange,
  title,
  currPeriod,
  prevPeriod,
  periodNames
) {
  const commonParams = {
    currPeriod,
    prevPeriod,
    periodNames,
    classes: 'govuk-grid-column-one-half',
    language: undefined
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
      [CopyAnswersMetricName.CopyAnswersForm]: createTile(
        COPY_ANSWERS_FORMS_TITLE,
        CopyAnswersMetricName.CopyAnswersForm,
        commonParams
      ),
      [CopyAnswersMetricName.CopyAnswersSubmission]: createTile(
        COPY_ANSWERS_SUBMISSIONS_TITLE,
        CopyAnswersMetricName.CopyAnswersSubmission,
        commonParams
      )
    }
  })
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric, FunctionalAreaMetricName, FunctionalAreaTotalsMetric} from '@defra/forms-model'
 */
