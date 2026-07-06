import { ComponentType } from '@defra/forms-model'

/**
 * @typedef {object} TranslationAttributes
 * @property {boolean} [hideBorder] - true if border is to be hidden
 * @property {boolean} [hideDescription] - true if description is to be hidden
 * @property {boolean} [styleEnglishAsHint] - true if english content is to be styled as grey hint text
 * @property {number} [textareaHeight] - number of rows for textarea when welsh content is to be shown as a textarea (as opposed to a standard text field)
 * @property {boolean} [showMarkdownHelp] - true if welsh content should show markdown help underneath
 */

/**
 * @typedef {object} Translation
 * @property {string} name - html element name
 * @property {string} contentType - for display
 * @property {string | undefined} englishContent - English text
 * @property {string | undefined} welshContent - Welsh text
 * @property {string} label - label associated with Welsh edit field
 * @property {TranslationAttributes} [attributes] - attributes such as hideBorder or hideDescription
 */

// Page-level
export const pageHeadingKey = 'pageHeading'
export const pageGuidanceKey = 'pageGuidance'

// Question-level
export const questionTextKey = 'title'
export const shortDescriptionKey = 'shortDescription'
export const hintKey = 'hint'
export const listItemTextKey = 'listItemText'
export const listItemHintKey = 'listItemHint'

/** @type {Record<string, { jsonPrefix: string, jsonSuffix: string, displayName: string, labelPart: string, attributes?: TranslationAttributes }>} */
export const keyConfig = {
  [questionTextKey]: {
    jsonPrefix: 'components',
    jsonSuffix: 'title',
    displayName: 'Question text',
    labelPart: 'question text'
  },
  [hintKey]: {
    jsonPrefix: 'components',
    jsonSuffix: 'hint',
    displayName: 'Hint',
    labelPart: 'hint',
    attributes: { textareaHeight: 3 }
  },
  [shortDescriptionKey]: {
    jsonPrefix: 'components',
    jsonSuffix: 'shortDescription',
    displayName: 'Short description',
    labelPart: 'short description'
  },
  [listItemTextKey]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'text',
    displayName: 'Option',
    labelPart: 'option'
  },
  [listItemHintKey]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'hint',
    displayName: 'Option',
    labelPart: 'hint for option'
  },
  [pageGuidanceKey]: {
    jsonPrefix: 'components',
    jsonSuffix: 'content',
    displayName: 'Guidance text',
    labelPart: 'guidance text (markdown)',
    attributes: { textareaHeight: 6, showMarkdownHelp: true }
  },
  [pageHeadingKey]: {
    jsonPrefix: 'pages',
    jsonSuffix: 'title',
    displayName: 'Page heading',
    labelPart: 'page heading'
  }
}

// List of fields that require translation of option values
export const FIELDS_WITH_SELECTION_OPTIONS = [
  ComponentType.CheckboxesField,
  ComponentType.RadiosField,
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
