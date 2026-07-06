import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponents
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getListFromComponent } from '~/src/lib/utils.js'
import {
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { buildPreviewUrl } from '~/src/models/forms/editor-v2/preview-helpers.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @typedef {object} TranslationAttributes
 * @property {boolean} [hideBorder] - true if border is to be hidden
 * @property {boolean} [hideDescription] - true if description is to be hidden
 * @property {boolean} [styleEnglishAsHint] - true if english content is to be styled as grey hint text
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

const questionTextKey = 'title'
const shortDescriptionKey = 'shortDescription'
const hintKey = 'hint'
const listItemTextKey = 'listItemText'
const listItemHintKey = 'listItemHint'

/** @type {Record<string, { jsonPrefix: string, jsonSuffix: string, displayName: string, labelPart: string }>} */
const keyConfig = {
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
    labelPart: 'hint'
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
  }
}

// List of fields that require translation of option values
const FIELDS_WITH_SELECTION_OPTIONS = [
  ComponentType.CheckboxesField,
  ComponentType.RadiosField,
  ComponentType.YesNoField
]

const IGNORE_FIELDS = [
  ComponentType.Details,
  ComponentType.Html,
  ComponentType.InsetText,
  ComponentType.HiddenField
]

const SAVE_ERROR_MESSAGE = 'Some invalid data keys were found'

/**
 * @param {string} key
 * @param { Record<string, string> | undefined } translations
 */
function lookupTranslation(key, translations) {
  if (!translations) {
    return ''
  }
  return translations[key] ?? ''
}

/**
 * @param {object | string} val
 * @returns {string}
 */
function drillDown(val) {
  if (typeof val === 'object') {
    return 'text' in val ? /** @type {string} */ (val.text) : ''
  }
  return val
}

/**
 * @param {Page} page
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 */
function buildPageSection(page, definition, translations) {
  const pageId = /** @type {string} */ (page.id)
  const pageNum = getPageNum(definition, pageId)
  return {
    title: `Page ${pageNum}`,
    table: buildPage(page, pageNum, translations)
  }
}

/**
 * @param {Page} page
 * @param {ComponentDef} component
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 */
function buildComponentSection(page, component, definition, translations) {
  const pageId = /** @type {string} */ (page.id)
  const componentId = /** @type {string} */ (component.id)
  const pageNum = getPageNum(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, componentId)

  return {
    title: `Page ${pageNum}, question ${questionNum}`,
    table: buildComponent(
      definition,
      component,
      pageNum,
      questionNum,
      translations
    )
  }
}

/**
 * @param {ComponentDef | Page | Item} entity
 * @param {string} keyType
 * @param {{ pageNum: number, questionNum: number , translations: Record<string, string>}} options
 * @param {number} [itemNum]
 * @param {TranslationAttributes} [attributes]
 */
function createRow(
  entity,
  keyType,
  { pageNum, questionNum, translations },
  itemNum,
  attributes
) {
  const keyProperties = keyConfig[keyType]
  const innerEnglishContent =
    keyProperties.jsonSuffix in entity
      ? // @ts-expect-error - dynamic lookup
        drillDown(entity[keyProperties.jsonSuffix])
      : ''

  return {
    name: `${keyProperties.jsonPrefix}.${entity.id}.${keyProperties.jsonSuffix}`,
    contentType: itemNum
      ? `${keyProperties.displayName} ${itemNum}`
      : keyProperties.displayName,
    englishContent: innerEnglishContent,
    welshContent: lookupTranslation(
      `${keyProperties.jsonPrefix}.${entity.id}.${keyProperties.jsonSuffix}`,
      translations
    ),
    label: itemNum
      ? `${keyProperties.labelPart} ${itemNum} - page ${pageNum}, question ${questionNum}`
      : `${keyProperties.labelPart} - page ${pageNum}, question ${questionNum}`,
    attributes
  }
}

/**
 * @param {Page} page
 * @param {number} pageNum
 * @param {Record<string, string>} translations
 * @returns {Translation[]}
 */
function buildPage(page, pageNum, translations) {
  if (
    page.controller &&
    page.controller !== ControllerType.Page &&
    page.controller !== ControllerType.Repeat &&
    page.controller !== ControllerType.Start
  ) {
    return []
  }

  if (
    page.components.filter((comp) => comp.type !== ComponentType.Markdown)
      .length === 0
  ) {
    return []
  }

  const pageRows = []
  if (page.title) {
    pageRows.push({
      name: `pages.${page.id}.title`,
      contentType: 'Page heading',
      englishContent: page.title,
      welshContent: lookupTranslation(`pages.${page.id}.title`, translations),
      label: `page heading - page ${pageNum}`
    })
  }

  const guidance =
    page.components[0].type === ComponentType.Markdown
      ? page.components[0]
      : undefined
  if (guidance) {
    pageRows.push({
      name: `components.${guidance.id}.content`,
      contentType: 'Guidance text',
      englishContent: guidance.content,
      welshContent: lookupTranslation(
        `components.${guidance.id}.content`,
        translations
      ),
      label: `guidance text (markdown) - page ${pageNum}`
    })
  }

  return pageRows
}

/**
 * @param {FormDefinition} definition
 * @param {ComponentDef} component
 * @param {number} pageNum
 * @param {number} questionNum
 * @param {Record<string, string>} translations
 */
function buildComponent(
  definition,
  component,
  pageNum,
  questionNum,
  translations
) {
  if (IGNORE_FIELDS.includes(component.type)) {
    return []
  }

  const fields = []

  const options = { pageNum, questionNum, translations }

  const typed = /** @type {InputFieldsComponentsDef} */ (component)
  if (typed.title) {
    fields.push(createRow(component, questionTextKey, options))
  }
  if (typed.hint) {
    fields.push(createRow(component, hintKey, options))
  }
  fields.push(createRow(component, shortDescriptionKey, options))

  if (FIELDS_WITH_SELECTION_OPTIONS.includes(component.type)) {
    const list = getListFromComponent(component, definition)
    if (list?.items.length) {
      let itemNum = 0
      for (const item of list.items) {
        itemNum++
        if (item.hint) {
          fields.push(
            createRow(item, listItemTextKey, options, itemNum, {
              hideBorder: true
            })
          )
          fields.push(
            createRow(item, listItemHintKey, options, itemNum, {
              hideDescription: true,
              styleEnglishAsHint: true
            })
          )
        } else {
          fields.push(createRow(item, listItemTextKey, options, itemNum))
        }
      }
    }
  }
  return fields
}

/**
 * @param {Translation} translation
 * @param {string} markdownHelpHtml
 * @param {boolean} hasError
 */
function buildTranslationHtml(translation, markdownHelpHtml, hasError) {
  const errorClass = hasError ? ' govuk-input--error' : ''
  const label = `<label class="govuk-label govuk-visually-hidden" for="${translation.name}">Welsh ${translation.label}</label>`
  if (translation.contentType === 'Hint') {
    return `${label}<textarea class="govuk-textarea${errorClass}" rows="3" lang="cy" name="${translation.name}" id="${translation.name}">${translation.welshContent}</textarea>`
  }

  if (translation.contentType === 'Guidance text') {
    return `${label}<textarea class="govuk-textarea${errorClass}" rows="6" lang="cy" name="${translation.name}" id="${translation.name}">${translation.welshContent}</textarea>${markdownHelpHtml}`
  }

  return `${label}<input type="text" lang="cy" class="govuk-input${errorClass}" name="${translation.name}" id="${translation.name}" value="${translation.welshContent}"/>`
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function buildTranslationRows(metadata, definition) {
  const translationsJSON = /** @type {Record<string, string>} */ (
    // @ts-expect-error - dynamic language definition
    definition.metadata?.translations?.cy
  )

  const allSections = []
  for (const page of definition.pages) {
    const components = hasComponents(page) ? page.components : []
    if (components.length) {
      allSections.push(buildPageSection(page, definition, translationsJSON))
      for (const component of components) {
        if (component.type === ComponentType.Markdown) {
          continue
        }
        allSections.push(
          buildComponentSection(page, component, definition, translationsJSON)
        )
      }
    }
  }

  return allSections
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} markdownHelpHtml
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function translationsViewModel(
  metadata,
  definition,
  markdownHelpHtml,
  validation,
  notification
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const previewBaseUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}?language=cy`
  const pageHeading = 'Add Welsh translations for your form'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const errorList = buildErrorList(validation?.formErrors)
  const errorSummary = errorList.length
    ? [{ text: SAVE_ERROR_MESSAGE }]
    : undefined

  const rows = buildTranslationRows(metadata, definition)

  const fieldTables = rows.map((section) => ({
    caption: section.title,
    firstCellIsHeader: false,
    head: section.table.length
      ? [
          {
            html: '<span class="govuk-visually-hidden">Field type</span>',
            classes: 'app-translation-table__empty-header-cell'
          },
          { text: 'English content' },
          { text: 'Welsh content' }
        ]
      : {},
    classes: 'govuk-!-margin-bottom-0 app-translation-table',
    rows: section.table.map((translation) => {
      const hideBorderClass = translation.attributes?.hideBorder
        ? ' app-no-border-bottom'
        : ''
      const hasError = errorList.some(
        (err) => err.href === `#${translation.name}`
      )
      return [
        {
          text: translation.attributes?.hideDescription
            ? ''
            : translation.contentType,
          classes: `govuk-table__header${hideBorderClass}`
        },
        {
          html: translation.attributes?.styleEnglishAsHint
            ? `<p class="govuk-body-s govuk-hint govuk-!-margin-bottom-0">${translation.englishContent}</p>`
            : translation.englishContent,
          classes: `govuk-!-text-break-word${hideBorderClass}`
        },
        {
          html: `<div class="govuk-form-group">${buildTranslationHtml(translation, markdownHelpHtml, hasError)}</div`,
          classes: hideBorderClass
        }
      ]
    })
  }))

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList: errorSummary,
    notification,
    fieldTables
  }
}

/**
 * Model to represent confirmation page dialog
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function deleteConfirmationPageViewModel(metadata, definition) {
  const backOrCancelUrl = editorv2Path(metadata.slug, 'welsh')
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  return {
    navigation,
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to Welsh translations'
    },
    useNewMasthead: true,
    pageHeading: {
      text: 'Are you sure you want to delete your Welsh translations?'
    },
    pageCaption: {
      text: definition.name
    },
    warning: {
      text: 'You cannot undo this action. You would need to enter Welsh translations again if you change your mind.'
    },
    bodyText:
      '<p class="govuk-body">This will delete all Welsh translations you have entered for this form.</p><p class="govuk-body">Your English form is not deleted.</p><p class="govuk-body">&nbsp;</p>',
    buttons: [
      {
        text: 'Delete Welsh translations',
        classes: 'govuk-button--warning'
      },
      {
        href: backOrCancelUrl,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { ComponentDef, InputFieldsComponentsDef, FormMetadata, FormDefinition, Item, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
