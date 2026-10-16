/**
 * Formats a currency amount with thousand separators and two decimal places
 * @param {Parameters<Intl.NumberFormat['format']>[0]} value
 * @param {string} [locale] - locale for formatting (e.g. 'en-GB', 'en-US')
 * @param {string} [currency] - currency code (e.g. 'GBP', 'USD')
 * @returns {string} Formatted amount (e.g., "£1,234.56")
 */
export function formatCurrency(value, locale = 'en-GB', currency = 'GBP') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })

  return formatter.format(value)
}
