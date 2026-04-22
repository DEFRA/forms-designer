/**
 * Formats a number with thousand separators
 * @param {Parameters<Intl.NumberFormat['format']>[0]} value
 * @param {string} [locale] - locale for formatting (e.g. 'en-GB', 'en-US')
 * @returns {string} Formatted amount (e.g., "1,234")
 */
export function formatNumber(value, locale = 'en-GB') {
  const formatter = new Intl.NumberFormat(locale)

  return formatter.format(value)
}
