import { ComponentType } from '~/src/components/enums.js'

/**
 * @typedef {object} TranslationRow
 * @property {string} name - the key name
 * @property {string} [type] - type of text
 * @property {string | undefined} englishContent - English text
 * @property {string | undefined} welshContent - Welsh text
 * @property {number} [pageNum] - page number
 * @property {number} [questionNum] - question number
 * @property {number} [itemNum] - list item number
 * @property {string} [label] - label for field
 */

/**
 * @typedef {{ text: string, href?: string }} ErrorDetailsItem
 * @typedef {Record<string, ErrorDetailsItem>} ErrorDetails
 */

/**
 * @template {object} [Schema=object]
 * @typedef {object} ValidationFailure
 * @property {ErrorDetails} formErrors - Formatted errors for error summary
 * @property {Schema} formValues - Form POST payload from Hapi request
 */

export const TranslationRowTypes = {
  PageHeading: 'PageHeading',
  PageGuidance: 'PageGuidance',
  QuestionText: 'QuestionText',
  QuestionHint: 'QuestionHint',
  ShortDescription: 'ShortDescription',
  ErrorDescription: 'ErrorDescription',
  ListItemText: 'ListItemText',
  ListItemHint: 'ListItemHint'
}

export const TEXTAREA_5_ROWS = 'textarea5'
export const TEXTAREA_12_ROWS_WITH_MARKDOWN = 'textarea12markdown'
export const LIST_ITEM_HINT = 'listitemhint'
export const LIST_ITEM_WITH_HINT_FOLLOWING = 'listoptionwithhintfollowing'

/** @type {Record<string, { jsonPrefix: string, jsonSuffix: string, displayName: string }>} */
export const keyConfig = {
  [TranslationRowTypes.QuestionText]: {
    jsonPrefix: 'components',
    jsonSuffix: 'title',
    displayName: 'Question text'
  },
  [TranslationRowTypes.QuestionHint]: {
    jsonPrefix: 'components',
    jsonSuffix: 'hint',
    displayName: 'Hint'
  },
  [TranslationRowTypes.ShortDescription]: {
    jsonPrefix: 'components',
    jsonSuffix: 'shortDescription',
    displayName: 'Short description'
  },
  [TranslationRowTypes.ListItemText]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'text',
    displayName: 'Option'
  },
  [TranslationRowTypes.ListItemHint]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'hint',
    displayName: 'Option hint'
  },
  [TranslationRowTypes.PageGuidance]: {
    jsonPrefix: 'components',
    jsonSuffix: 'content',
    displayName: 'Guidance text'
  },
  [TranslationRowTypes.PageHeading]: {
    jsonPrefix: 'pages',
    jsonSuffix: 'title',
    displayName: 'Page heading'
  }
}

// List of fields that require translation of option values
export const FIELDS_WITH_SELECTION_OPTIONS = [
  ComponentType.AutocompleteField,
  ComponentType.CheckboxesField,
  ComponentType.RadiosField,
  ComponentType.SelectField,
  ComponentType.YesNoField
]

export const IGNORE_FIELDS = [
  ComponentType.Details,
  ComponentType.Html,
  ComponentType.InsetText,
  ComponentType.HiddenField
]

/**
 * @param {string} key
 * @param { Record<string, string> | undefined } translations
 */
export function lookupTranslation(key, translations) {
  if (!translations) {
    return ''
  }
  return translations[key] ?? ''
}

/**
 * @param {object | string} val
 * @returns {string}
 */
export function drillDown(val) {
  if (typeof val === 'object') {
    return 'text' in val ? /** @type {string} */ (val.text) : ''
  }
  return val
}
