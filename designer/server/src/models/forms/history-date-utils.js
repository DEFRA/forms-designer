import { isDate, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale/en-GB'
import { formatInTimeZone } from 'date-fns-tz'

const UK_TIMEZONE = 'Europe/London'

/**
 * Converts a date string or Date object to a Date object
 * @param {Date | string} date
 * @returns {Date}
 */
export function toDate(date) {
  return isDate(date) ? date : parseISO(date)
}

/**
 * Format a date in UK timezone (Europe/London) and locale (enGB)
 * @param {Date} date
 * @param {string} formatStr
 * @returns {string}
 */
function format(date, formatStr) {
  return formatInTimeZone(date, UK_TIMEZONE, formatStr, {
    locale: enGB
  })
}

/**
 * Formats a date for display in the history timeline
 * @param {Date | string} date
 * @returns {string}
 */
export function formatHistoryDate(date) {
  const dateObj = toDate(date)
  return format(dateObj, "d MMMM yyyy 'at' h:mmaaa")
}

/**
 * Formats a time for display (e.g., "3:30pm")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatTime(date) {
  const dateObj = toDate(date)
  return format(dateObj, 'h:mmaaa')
}

/**
 * Formats a short date (e.g., "14 June")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatShortDate(date) {
  const dateObj = toDate(date)
  return format(dateObj, 'd MMMM')
}

/**
 * Checks if two dates are on the same day (in UK timezone)
 * @param {Date | string} date1
 * @param {Date | string} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  const day1 = format(toDate(date1), 'yyyy-MM-dd')
  const day2 = format(toDate(date2), 'yyyy-MM-dd')
  return day1 === day2
}
