import { ComponentType } from '~/src/components/enums.js'
import { isListType, isTypeWithInstructions } from '~/src/components/helpers.js'
import {
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
import {
  hasComponents,
  hasComponentsEvenIfNoNext,
  isSummaryPage
} from '~/src/pages/helpers.js'

/**
 * Create a translation row for a single entity field.
 * @param {ComponentDef | Page | Item} entity - The source entity that contains the English content.
 * @param {string} keyType - The translation row type to build.
 * @param {{ pageNum: number, questionNum?: number, itemNum?: number, translations: Record<string, string>, validation?: ValidationFailure<any> }} options - The row context including numbering and translation values.
 * @returns {TranslationRow} The populated translation row for the entity field.
 */
function createRow(
  entity,
  keyType,
  { pageNum, questionNum, itemNum, translations, validation }
) {
  const keyProperties = keyConfig[keyType]

  const innerEnglishContent = drillDown(
    keyType,
    entity,
    keyProperties.jsonSuffix
  )

  const keyName = `${keyProperties.jsonPrefix}.${entity.id}.${keyProperties.jsonSuffix}`

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
    label: keyProperties.getLabel(pageNum, questionNum, itemNum)
  }
}

const allowedControllerTypesSet = new Set([
  ControllerType.Page,
  ControllerType.Repeat,
  ControllerType.Start,
  ControllerType.FileUpload,
  ControllerType.Terminal,
  ControllerType.Summary,
  ControllerType.SummaryWithConfirmationEmail
])

/**
 * Constructs a page row
 * @param {string} rowType
 * @param { string | undefined } id
 * @param {number} pageNum
 * @param {string} englishContent
 * @param {Record<string, string>} translations - Existing Welsh translations keyed by translation name.
 * @param {ValidationFailure<any>} [validation] - Optional validation context for posted form values.
 */
function buildPageRow(
  rowType,
  id,
  pageNum,
  englishContent,
  translations,
  validation
) {
  const keyProperties = keyConfig[rowType]
  const keyName = `${keyProperties.jsonPrefix}.${id}.${keyProperties.jsonSuffix}`

  return {
    name: keyName,
    type: rowType,
    pageNum,
    englishContent,
    welshContent:
      validation?.formValues[keyName] ??
      lookupTranslation(keyName, translations),
    label: keyProperties.getLabel(pageNum)
  }
}

/**
 * Build the translation rows for a single page.
 * @param {Page} page - The page definition to inspect for translatable content.
 * @param {number} pageNum - The page number used in the generated labels.
 * @param {Record<string, string>} translations - Existing Welsh translations keyed by translation name.
 * @param {ValidationFailure<any>} [validation] - Optional validation context for posted form values.
 * @returns {TranslationRow[]} The translation rows generated for the page.
 */
function buildPage(page, pageNum, translations, validation) {
  if (page.controller && !allowedControllerTypesSet.has(page.controller)) {
    return []
  }

  const translationRows = []

  // The only possible element for translation on a summary page is the end-of-form declaration,
  // so we don't proceed further in this case
  if (isSummaryPage(page)) {
    const endOfFormDeclaration =
      hasComponentsEvenIfNoNext(page) &&
      page.components[0].type === ComponentType.Markdown
        ? page.components[0]
        : undefined
    if (endOfFormDeclaration) {
      translationRows.push(
        buildPageRow(
          TranslationRowTypes.EndOfFormDeclarationBody,
          endOfFormDeclaration.id,
          pageNum,
          endOfFormDeclaration.content,
          translations,
          validation
        )
      )
    }
    return translationRows
  }

  if (page.title) {
    translationRows.push(
      buildPageRow(
        TranslationRowTypes.PageHeading,
        page.id,
        pageNum,
        page.title,
        translations,
        validation
      )
    )
  }

  const guidance =
    hasComponents(page) && page.components[0].type === ComponentType.Markdown
      ? page.components[0]
      : undefined
  if (guidance) {
    translationRows.push(
      buildPageRow(
        TranslationRowTypes.PageGuidance,
        guidance.id,
        pageNum,
        guidance.content,
        translations,
        validation
      )
    )
  }

  if (page.controller === ControllerType.Repeat) {
    translationRows.push(
      buildPageRow(
        TranslationRowTypes.RepeatTitle,
        page.id,
        pageNum,
        page.repeat.options.title,
        translations,
        validation
      )
    )
  }

  return translationRows
}

/**
 * Build the translation rows for a single component.
 * @param {FormDefinition} definition - The overall form definition used to resolve list-based content.
 * @param {ComponentDef} component - The component to inspect for translatable fields.
 * @param {number} pageNum - The page number used in the generated labels.
 * @param {number} questionNum - The question number used in the generated labels.
 * @param {Record<string, string>} translations - Existing Welsh translations keyed by translation name.
 * @param {ValidationFailure<any>} [validation] - Optional validation context for posted form values.
 * @returns {TranslationRow[]} The translation rows generated for the component.
 */
export function buildComponent(
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
  if (typed.title && component.type !== ComponentType.PaymentField) {
    rows.push(createRow(component, TranslationRowTypes.QuestionText, options))
  }
  if (typed.hint) {
    rows.push(createRow(component, TranslationRowTypes.QuestionHint, options))
  }

  if (component.type !== ComponentType.PaymentField) {
    rows.push(
      createRow(component, TranslationRowTypes.ShortDescription, options)
    )
    if (typed.errorDescription) {
      rows.push(
        createRow(component, TranslationRowTypes.ErrorDescription, options)
      )
    }
  } else {
    rows.push(
      createRow(component, TranslationRowTypes.PaymentDescription, options)
    )
  }

  if (component.type === ComponentType.DeclarationField) {
    rows.push(
      createRow(component, TranslationRowTypes.DeclarationBody, options)
    )
  }

  if (typed.options.instructionText && isTypeWithInstructions(component.type)) {
    rows.push(
      createRow(component, TranslationRowTypes.InstructionText, options)
    )
  }

  if (isListType(component.type)) {
    addSelectionOptions(rows, component, definition, options)
  }
  return rows
}

/**
 * Add translation rows for the select item options of a list-based component.
 * @param {any[]} rows - The accumulator for translation rows.
 * @param {ComponentDef} component - The list-based component to inspect.
 * @param {FormDefinition} definition - The form definition that contains the option list data.
 * @param {{ pageNum: number, questionNum?: number, translations: Record<string, string>, validation?: ValidationFailure<any> }} options - The row context including numbering and translation values.
 */
function addSelectionOptions(rows, component, definition, options) {
  // Temporary workaround - ignore for Yes/No and use defaults in the plugin,
  // until we create a solution that allows users to override the Yes/No options
  if (component.type === ComponentType.YesNoField) {
    return
  }

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
 * Build the overview and form translation rows for a form definition.
 * @param {FormMetadata} metadata - The form metadata used to build the overview section.
 * @param {FormDefinition} definition - The form definition containing pages and components.
 * @param {ValidationFailure<any>} [validation] - Optional validation context for posted form values.
 * @returns {{ overviewRows: TranslationRow[], formRows: TranslationRow[] }} The generated overview and form translation rows.
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
    const components = hasComponentsEvenIfNoNext(page) ? page.components : []
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
 * @import { ComponentDef, InputFieldsComponentsDef } from '~/src/components/types.js'
 * @import { FormMetadata } from '~/src/form/form-metadata/types.js'
 * @import { FormDefinition, Item, Page } from '~/src/form/form-definition/types.js'
 * @import { TranslationRow, ValidationFailure } from '~/src/form/form-editor/translations/translations-config.js'
 */
