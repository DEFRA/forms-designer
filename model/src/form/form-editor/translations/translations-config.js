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
  RepeatTitle: 'RepeatTitle',
  QuestionText: 'QuestionText',
  QuestionHint: 'QuestionHint',
  ShortDescription: 'ShortDescription',
  ErrorDescription: 'ErrorDescription',
  ListItemText: 'ListItemText',
  ListItemHint: 'ListItemHint',
  InstructionText: 'InstructionText',
  DeclarationBody: 'DeclarationBody',
  PaymentDescription: 'PaymentDescription'
}

export const TEXTAREA_3_ROWS = 'textarea3'
export const TEXTAREA_5_ROWS = 'textarea5'
export const TEXTAREA_12_ROWS_WITH_MARKDOWN = 'textarea12markdown'
export const LIST_ITEM_HINT = 'listitemhint'
export const LIST_ITEM_WITH_HINT_FOLLOWING = 'listoptionwithhintfollowing'

/** @type {Record<string, { jsonPrefix: string, jsonSuffix: string, displayName: string, getLabel: (pageNum: number, questionNum?: number, itemNum?: number) => string }>} */
export const keyConfig = {
  [TranslationRowTypes.QuestionText]: {
    jsonPrefix: 'components',
    jsonSuffix: 'title',
    displayName: 'Question text',
    getLabel: (pageNum, questionNum) =>
      `Welsh question text - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.QuestionHint]: {
    jsonPrefix: 'components',
    jsonSuffix: 'hint',
    displayName: 'Hint',
    getLabel: (pageNum, questionNum) =>
      `Welsh hint - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.ShortDescription]: {
    jsonPrefix: 'components',
    jsonSuffix: 'shortDescription',
    displayName: 'Short description',
    getLabel: (pageNum, questionNum) =>
      `Welsh short description - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.InstructionText]: {
    jsonPrefix: 'components',
    jsonSuffix: 'instructionText',
    displayName: 'Instruction text',
    getLabel: (pageNum, questionNum) =>
      `Welsh instruction text - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.DeclarationBody]: {
    jsonPrefix: 'components',
    jsonSuffix: 'content',
    displayName: 'Declaration body',
    getLabel: (pageNum, questionNum) =>
      `Welsh declaration body - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.PaymentDescription]: {
    jsonPrefix: 'components',
    jsonSuffix: 'paymentDescription',
    displayName: 'Payment description',
    getLabel: (pageNum, questionNum) =>
      `Welsh payment description - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.ListItemText]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'text',
    displayName: 'Option',
    getLabel: (pageNum, questionNum, itemNum) =>
      `Welsh option ${itemNum} - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.ListItemHint]: {
    jsonPrefix: 'listItems',
    jsonSuffix: 'hint',
    displayName: 'Option hint',
    getLabel: (pageNum, questionNum, itemNum) =>
      `Welsh hint for option ${itemNum} - Page ${pageNum}, question ${questionNum}`
  },
  [TranslationRowTypes.PageGuidance]: {
    jsonPrefix: 'components',
    jsonSuffix: 'content',
    displayName: 'Guidance text',
    getLabel: (pageNum) => `Welsh guidance text (markdown) - page ${pageNum}`
  },
  [TranslationRowTypes.PageHeading]: {
    jsonPrefix: 'pages',
    jsonSuffix: 'title',
    displayName: 'Page heading',
    getLabel: (pageNum) => `Welsh page heading - page ${pageNum}`
  },
  [TranslationRowTypes.RepeatTitle]: {
    jsonPrefix: 'pages',
    jsonSuffix: 'repeatTitle',
    displayName: 'Repeat name',
    getLabel: (pageNum) => `Welsh repeat name - page ${pageNum}`
  }
}

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
  } else if (keyType === TranslationRowTypes.PaymentDescription) {
    // @ts-expect-error - dynamic lookup
    return 'options' in entity ? entity.options?.description : ''
  } else {
    const entityWithDynamicProperties = /** @type {Record<string, unknown>} */ (
      /** @type {unknown} */ (entity)
    )
    if (typeof entity === 'object') {
      return jsonSuffix in entityWithDynamicProperties
        ? /** @type {string} */ (entityWithDynamicProperties[jsonSuffix])
        : ''
    }
  }
  return entity
}

/**
 * @import { ComponentDef } from '~/src/components/types.js'
 * @import { Item, Page } from '~/src/form/form-definition/types.js'
 */
