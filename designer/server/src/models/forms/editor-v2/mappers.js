/**
 * @param {string} autoCompleteRow
 * @returns {{text: string, value: string}}
 */
export function mapAutoCompleteRow(autoCompleteRow) {
  const [unSanitisedText, unSanitisedValue] = /** @type {[string, string?]} */ (
    autoCompleteRow.split(':')
  )

  const text = unSanitisedText.trim()
  const value = (unSanitisedValue ?? text).trim()

  return { text, value }
}

/**
 * @param {string} autoCompleteString
 * @returns {Item[]}
 */
export function parseAutoCompleteString(autoCompleteString) {
  return autoCompleteString.split(/\r?\n/).map(mapAutoCompleteRow)
}

/**
 * @import { Item } from '@defra/forms-model'
 */
