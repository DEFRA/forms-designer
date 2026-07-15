import { ComponentType } from '~/src/components/enums.js'
import {
  FIELDS_WITH_SELECTION_OPTIONS,
  IGNORE_FIELDS,
  TranslationRowTypes,
  drillDown,
  keyConfig,
  lookupTranslation
} from '~/src/form/form-editor/translations/translations-config.js'
import { buildOverviewSection } from '~/src/form/form-editor/translations/translations-overview.js'
import { getListFromComponent } from '~/src/form/utils/list.js'
import { getPageNum, getQuestionNum } from '~/src/form/utils/numbering.js'
import { ControllerType } from '~/src/pages/enums.js'
import { hasComponents } from '~/src/pages/helpers.js'

/**
 * @param {ComponentDef | Page | Item} entity
 * @param {string} keyType
 * @param {{ pageNum: number, questionNum?: number, itemNum?: number, translations: Record<string, string>,  validation?: ValidationFailure<any> }} options
 * @returns {TranslationRow}
 */
function createRow(
  entity,
  keyType,
  { pageNum, questionNum, itemNum, translations, validation }
) {
  const keyProperties = keyConfig[keyType]
  const entityWithDynamicProperties = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (entity)
  )
  const innerEnglishContent =
    keyProperties.jsonSuffix in entityWithDynamicProperties
      ? drillDown(
          /** @type {string | { text: string }} */ (
            entityWithDynamicProperties[keyProperties.jsonSuffix]
          )
        )
      : ''

  const keyName = `${keyProperties.jsonPrefix}.${entity.id}.${keyProperties.jsonSuffix}`

  let label
  if (keyType === TranslationRowTypes.QuestionText) {
    label = `Welsh question text - Page ${pageNum}, question ${questionNum}`
  } else if (keyType === TranslationRowTypes.QuestionHint) {
    label = `Welsh hint - Page ${pageNum}, question ${questionNum}`
  } else if (keyType === TranslationRowTypes.ShortDescription) {
    label = `Welsh short description - Page ${pageNum}, question ${questionNum}`
  } else if (keyType === TranslationRowTypes.ListItemText) {
    label = `Welsh option ${itemNum} - Page ${pageNum}, question ${questionNum}`
  } else if (keyType === TranslationRowTypes.ListItemHint) {
    label = `Welsh hint for option ${itemNum} - Page ${pageNum}, question ${questionNum}`
  } else {
    label = ''
  }

  return {
    name: keyName,
    type: keyType,
    pageNum,
    questionNum,
    itemNum,
    englishContent: innerEnglishContent,
    welshContent:
      validation?.formValues[keyName] ??
      lookupTranslation(keyName, translations),
    label
  }
}

const allowedControllerTypesSet = new Set([
  ControllerType.Page,
  ControllerType.Repeat,
  ControllerType.Start,
  ControllerType.FileUpload,
  ControllerType.Terminal
])

/**
 * @param {Page} page
 * @param {number} pageNum
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {TranslationRow[]}
 */
function buildPage(page, pageNum, translations, validation) {
  if (page.controller && !allowedControllerTypesSet.has(page.controller)) {
    return []
  }

  const translationRows = []
  if (page.title) {
    const keyProperties = keyConfig[TranslationRowTypes.PageHeading]

    const keyName = `${keyProperties.jsonPrefix}.${page.id}.${keyProperties.jsonSuffix}`

    translationRows.push({
      name: keyName,
      type: TranslationRowTypes.PageHeading,
      pageNum,
      englishContent: page.title,
      welshContent:
        validation?.formValues[keyName] ??
        lookupTranslation(keyName, translations),
      label: `Welsh page heading - page ${pageNum}`
    })
  }

  const guidance =
    hasComponents(page) && page.components[0].type === ComponentType.Markdown
      ? page.components[0]
      : undefined
  if (guidance) {
    const keyProperties = keyConfig[TranslationRowTypes.PageGuidance]
    const keyName = `${keyProperties.jsonPrefix}.${page.id}.${keyProperties.jsonSuffix}`

    translationRows.push({
      name: keyName,
      type: TranslationRowTypes.PageGuidance,
      pageNum,
      englishContent: guidance.content,
      welshContent:
        validation?.formValues[keyName] ??
        lookupTranslation(keyName, translations),
      label: `Welsh guidance text (markdown) - page ${pageNum}`
    })
  }

  return translationRows
}

/**
 * @param {FormDefinition} definition
 * @param {ComponentDef} component
 * @param {number} pageNum
 * @param {number} questionNum
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {TranslationRow[]}
 */
function buildComponent(
  definition,
  component,
  pageNum,
  questionNum,
  translations,
  validation
) {
  if (IGNORE_FIELDS.includes(component.type)) {
    return []
  }

  const rows = []

  const options = { pageNum, questionNum, translations, validation }

  const typed = /** @type {InputFieldsComponentsDef} */ (component)
  if (typed.title) {
    rows.push(createRow(component, TranslationRowTypes.QuestionText, options))
  }
  if (typed.hint) {
    rows.push(createRow(component, TranslationRowTypes.QuestionHint, options))
  }
  rows.push(createRow(component, TranslationRowTypes.ShortDescription, options))

  if (FIELDS_WITH_SELECTION_OPTIONS.includes(component.type)) {
    addSelectionOptions(rows, component, definition, options)
  }
  return rows
}

/**
 * @param {any[]} rows
 * @param {ComponentDef} component
 * @param {FormDefinition} definition
 * @param {{ pageNum: number, questionNum?: number , translations: Record<string, string>,  validation?: ValidationFailure<any> }} options
 */
function addSelectionOptions(rows, component, definition, options) {
  const list = getListFromComponent(component, definition)
  if (list?.items.length) {
    let itemNum = 0
    for (const item of list.items) {
      itemNum++
      const listOptions = {
        ...options,
        itemNum
      }
      if (item.hint) {
        rows.push(
          createRow(item, TranslationRowTypes.ListItemText, listOptions),
          createRow(item, TranslationRowTypes.ListItemHint, listOptions)
        )
      } else {
        rows.push(
          createRow(item, TranslationRowTypes.ListItemText, listOptions)
        )
      }
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 */
export function buildTranslationDataRows(metadata, definition, validation) {
  const translationsJSON = /** @type {Record<string, string>} */ (
    // @ts-expect-error - dynamic language definition
    definition.metadata?.translations?.cy
  )

  const overviewRows = buildOverviewSection(
    metadata,
    definition,
    translationsJSON,
    validation
  )

  const formRows = []
  for (const page of definition.pages) {
    const pageId = /** @type {string} */ (page.id)
    const pageNum = getPageNum(definition, pageId)
    const components = hasComponents(page) ? page.components : []
    if (components.length === 0) {
      continue
    }

    formRows.push(...buildPage(page, pageNum, translationsJSON, validation))

    for (const component of components) {
      if (component.type === ComponentType.Markdown) {
        continue
      }
      const questionId = /** @type {string} */ (component.id)
      const questionNum = getQuestionNum(definition, pageId, questionId)

      formRows.push(
        ...buildComponent(
          definition,
          component,
          pageNum,
          questionNum,
          translationsJSON,
          validation
        )
      )
    }
  }

  return {
    overviewRows,
    formRows
  }
}

/**
 * @import { ComponentDef, InputFieldsComponentsDef, ListComponentsDef } from '~/src/components/types.js'
 * @import { FormMetadata } from '~/src/form/form-metadata/types.js'
 * @import { FormDefinition, Item, Page } from '~/src/form/form-definition/types.js'
 * @import { TranslationRow, ValidationFailure } from '~/src/form/form-editor/translations/translations-config.js'
 */
