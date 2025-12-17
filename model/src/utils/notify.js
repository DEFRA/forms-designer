/**
 * Notify auto-translates ASCII hyphens to en dashes.
 * This method is used to escape ASCII hyphens so Notify doesn't translate the content.
 * @param {string} str
 */
export function escapeHyphens(str) {
  return str.replaceAll('-', '&hyphen;')
}

const dotRegex = /\s+\./gi
const commaRegex = /\s+,/gi
const colonRegex = /\s+:/gi
const semicolonRegex = /\s+;/gi
const exclamationRegex = /\s+!/gi

/**
 * Notify strips whitespace if it occurs before punctuation.
 * This method performs the same translation so say our filenames can match the resulting content from Notify.
 * @param {string} str - the input string
 */
export function stripWhitespaceBeforePunctuation(str) {
  return str
    .replaceAll(dotRegex, '.')
    .replaceAll(commaRegex, ',')
    .replaceAll(colonRegex, ':')
    .replaceAll(semicolonRegex, ';')
    .replaceAll(exclamationRegex, '!')
}
