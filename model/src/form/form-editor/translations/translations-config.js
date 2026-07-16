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
  ListItemHint: 'ListItemHint',
  InstructionText: 'InstructionText',
  DeclarationBody: 'DeclarationBody'
}

export const TEXTAREA_3_ROWS = 'textarea3'
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
  [TranslationRowTypes.InstructionText]: {
    jsonPrefix: 'components',
    jsonSuffix: 'instructionText',
    displayName: 'Instruction text'
  },
  [TranslationRowTypes.DeclarationBody]: {
    jsonPrefix: 'components',
    jsonSuffix: 'content',
    displayName: 'Declaration body'
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

// Primarily Location field but those that can have user-supplied instructions
export const FIELDS_WITH_INSTRUCTIONS = [
  ComponentType.EastingNorthingField,
  ComponentType.OsGridRefField,
  ComponentType.NationalGridFieldNumberField,
  ComponentType.LatLongField
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
 * @param {string} keyType
 * @param {ComponentDef | Page | Item} entity
 * @param {string} jsonSuffix
 * @returns {string}
 */
export function drillDown(keyType, entity, jsonSuffix) {
  if (keyType === TranslationRowTypes.InstructionText) {
    // @ts-expect-error - dynamic lookup
    return 'options' in entity ? entity.options?.instructionText : ''
  } else if (keyType === TranslationRowTypes.ListItemHint) {
    // @ts-expect-error - dynamic lookup
    return 'hint' in entity ? entity.hint.text : ''
  } else if (keyType === TranslationRowTypes.DeclarationBody) {
    return 'content' in entity ? entity.content : ''
  }

  const entityWithDynamicProperties = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (entity)
  )
  if (typeof entity === 'object') {
    return jsonSuffix in entityWithDynamicProperties
      ? /** @type {string} */ (entityWithDynamicProperties[jsonSuffix])
      : ''
  }
  return entity
}

/**
 * @import { ComponentDef } from '~/src/components/types.js'
 * @import { Item, Page } from '~/src/form/form-definition/types.js'
 */
