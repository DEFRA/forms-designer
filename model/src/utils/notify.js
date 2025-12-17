import RE2 from 're2'

/**
 * Notify auto-translates ASCII hyphens to en dashes.
 * This method is used to escape ASCII hyphens so Notify doesn't translate the content.
 * @param {string} str
 */
export function escapeHyphens(str) {
  return str.replaceAll('-', '&hyphen;')
}

// RE2 is used to mitigate the risk of DOS attacks that standard Regex is vulnerable to
const dotRegex = new RE2(/\s+\./g)
const commaRegex = new RE2(/\s+,/g)
const colonRegex = new RE2(/\s+:/g)
const semicolonRegex = new RE2(/\s+;/g)
const exclamationRegex = new RE2(/\s+!/g)

/**
 * Notify strips whitespace if it occurs before punctuation.
 * This method performs the same translation so say our filenames can match the resulting content from Notify.
 * @param {string} str - the input string
 */
export function stripWhitespaceBeforePunctuation(str) {
  return str
    .replace(dotRegex, '.')
    .replace(commaRegex, ',')
    .replace(colonRegex, ':')
    .replace(semicolonRegex, ';')
    .replace(exclamationRegex, '!')
}
