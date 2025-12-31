/**
 * Converts a date string or Date object to a Date object
 * @param {Date | string} date
 * @returns {Date}
 */
export function toDate(date) {
  return typeof date === 'string' ? new Date(date) : date
}

/**
 * Formats a date for display in the history timeline
 * @param {Date | string} date
 * @returns {string}
 */
export function formatHistoryDate(date) {
  const dateObj = toDate(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en-GB', { month: 'long' })
  const year = dateObj.getFullYear()
  const time = dateObj.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${day} ${month} ${year} at ${time}`
}

/**
 * Formats a time for display (e.g., "3:30pm")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatTime(date) {
  const dateObj = toDate(date)
  return dateObj.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Formats a short date (e.g., "14 June")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatShortDate(date) {
  const dateObj = toDate(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en-GB', { month: 'long' })
  return `${day} ${month}`
}

/**
 * Checks if two dates are on the same day
 * @param {Date | string} date1
 * @param {Date | string} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  const d1 = toDate(date1)
  const d2 = toDate(date2)

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  )
}
