import Joi from 'joi'

/**
 * @param {string} autoCompleteRow
 * @returns {Item}
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
 * @param {string} value
 * @param {CustomHelpers<Item[]>} helpers
 * @returns {Item[] | ErrorReport}
 */
export function autoCompleteValidator(value, helpers) {
  try {
    const autoCompleteOptions = parseAutoCompleteString(value)

    if (autoCompleteOptions.length === 0) {
      return helpers.error('array.length')
    }

    return autoCompleteOptions
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e, `Invalid parse of ${value}`)
    return helpers.error('parse.error')
  }
}

export const autoCompleteOptionsSchema = Joi.any().custom(autoCompleteValidator)

/**
 * @import { Item } from '@defra/forms-model'
 * @import { CustomValidator, CustomHelpers, ErrorReport } from 'joi'
 */
