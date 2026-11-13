import { CopyAnswersMetricName } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import {
  ALL_TIME_TEXT,
  COPY_ANSWERS_FORMS_TITLE,
  COPY_ANSWERS_SUBMISSIONS_TITLE,
  FULL_DATE_MASK,
  LAST_30_DAYS_TEXT,
  LAST_7_DAYS_TEXT,
  SEVEN_DAYS,
  THIRTY_DAYS
} from '~/src/models/admin/metrics-constants.js'
import { createTile } from '~/src/models/admin/metrics-helper.js'

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
    LAST_7_DAYS_TEXT,
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days
  )

  const last30Days = mapCopyAnswersTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    LAST_30_DAYS_TEXT,
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days
  )

  const allTime = mapCopyAnswersTiles(
    { fromDate: totals.earliestDate, toDate: reportMorning },
    ALL_TIME_TEXT,
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
 * @import { FormOverviewMetric, FunctionalAreaMetricName, FunctionalAreaTotalsMetric } from '@defra/forms-model'
 * @import { FormTilesView, PeriodName, TableRowMetric } from '~/src/models/admin/metrics-types.js'
 */
