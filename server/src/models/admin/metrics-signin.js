import { SigninMetricName } from '@defra/forms-model'
import { format, startOfDay, subDays } from 'date-fns'

import {
  ACCOUNT_DELETIONS_TITLE,
  ALL_TIME_TEXT,
  EMAIL_ADDRESS_UPDATES_TITLE,
  FULL_DATE_MASK,
  INCORRECT_CODE_ENTERED_TITLE,
  LAST_30_DAYS_TEXT,
  LAST_7_DAYS_TEXT,
  PHONE_NUMBER_UPDATES_TITLE,
  REGISTRATIONS_TITLE,
  SEVEN_DAYS,
  SUCCESSFUL_AUTHENTICATIONS_TITLE,
  THIRTY_DAYS,
  TOO_MANY_CODE_REQUESTS_TITLE
} from '~/src/models/admin/metrics-constants.js'
import { createTile } from '~/src/models/admin/metrics-helper.js'

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
    LAST_7_DAYS_TEXT,
    totals.last7Days,
    totals.prev7Days,
    tilePeriodNames.last7Days
  )

  const last30Days = mapSigninTiles(
    { fromDate: thirtyDaysAgo, toDate: reportMorning },
    LAST_30_DAYS_TEXT,
    totals.last30Days,
    totals.prev30Days,
    tilePeriodNames.last30Days
  )

  const allTime = mapSigninTiles(
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
 * @import { FunctionalAreaMetricName, FunctionalAreaTotalsMetric } from '@defra/forms-model'
 * @import { FormTilesView, PeriodName } from '~/src/models/admin/metrics-types.js'
 */
