import { format, isDate, parseISO } from 'date-fns'

/**
 * @param {string} value
 * @param {string} [formattedDateStr]
 */
function formatDate(value, formattedDateStr = 'd MMM yyyy') {
  const date = isDate(value) ? value : parseISO(value)

  return format(date, formattedDateStr)
}

export { formatDate }
