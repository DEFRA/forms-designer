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
import {
  FIELDS_WITH_SELECTION_OPTIONS,
  IGNORE_FIELDS,
  drillDown,
  hintKey,
  keyConfig,
  listItemHintKey,
  listItemTextKey,
  lookupTranslation,
  pageGuidanceKey,
  pageHeadingKey,
  questionTextKey,
  shortDescriptionKey
} from '~/src/models/forms/editor-v2/translations-config.js'
import { buildOverviewSection } from '~/src/models/forms/editor-v2/translations-overview.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {Page} page
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 */
function buildPageSection(page, definition, translations, validation) {
  const pageId = /** @type {string} */ (page.id)
  const pageNum = getPageNum(definition, pageId)
  return {
    title: `Page ${pageNum}`,
    table: buildPage(page, pageNum, translations, validation)
  }
}

/**
 * @param {Page} page
 * @param {ComponentDef} component
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 */
function buildComponentSection(page, component, definition, translations, validation) {
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
      translations,
      validation
    )
  }
}

/**
 * @param {ComponentDef | Page | Item} entity
 * @param {string} keyType
 * @param {{ pageNum: number, questionNum?: number , translations: Record<string, string>,  validation?: ValidationFailure<any> }} options
 * @param {number} [itemNum]
 * @param {TranslationAttributes} [attributes]
 */
function createRow(
  entity,
  keyType,
  { pageNum, questionNum, translations, validation },
  itemNum,
  attributes
) {
  const keyProperties = keyConfig[keyType]
  const innerEnglishContent =
    keyProperties.jsonSuffix in entity
      ? // @ts-expect-error - dynamic lookup
        drillDown(entity[keyProperties.jsonSuffix])
      : ''

  const keyName = `${keyProperties.jsonPrefix}.${entity.id}.${keyProperties.jsonSuffix}`

  const pageAndQuestion = questionNum
    ? `page ${pageNum}, question ${questionNum}`
    : `page ${pageNum}`
  return {
    name: keyName,
    contentType: itemNum
      ? `${keyProperties.displayName} ${itemNum}`
      : keyProperties.displayName,
    englishContent: innerEnglishContent,
    welshContent: validation?.formValues[keyName] ?? lookupTranslation(keyName, translations),
    label: itemNum
      ? `${keyProperties.labelPart} ${itemNum} - ${pageAndQuestion}`
      : `${keyProperties.labelPart} - ${pageAndQuestion}`,
    attributes: {
      ...keyProperties.attributes,
      ...attributes
    }
  }
}

/**
 * @param {Page} page
 * @param {number} pageNum
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {Translation[]}
 */
function buildPage(page, pageNum, translations, validation) {
  if (
    page.controller &&
    page.controller !== ControllerType.Page &&
    page.controller !== ControllerType.Repeat &&
    page.controller !== ControllerType.Start &&
    page.controller !== ControllerType.FileUpload &&
    page.controller !== ControllerType.Terminal
  ) {
    return []
  }

  const pageRows = []
  if (page.title) {
    pageRows.push(createRow(page, pageHeadingKey, { pageNum, translations, validation }))
  }

  const guidance =
    page.components.length && page.components[0].type === ComponentType.Markdown
      ? page.components[0]
      : undefined
  if (guidance) {
    pageRows.push(
      createRow(guidance, pageGuidanceKey, { pageNum, translations, validation })
    )
  }

  return pageRows
}

/**
 * @param {FormDefinition} definition
 * @param {ComponentDef} component
 * @param {number} pageNum
 * @param {number} questionNum
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {Translation[]}
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

  const fields = []

  const options = { pageNum, questionNum, translations, validation }

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
 * @param {ErrorDetailsItem[]} errors
 */
function buildTranslationHtml(translation, markdownHelpHtml, errors) {
  const hasError = errors.some((err) => err.href === `#${translation.name}`)
  const errorClass = hasError ? ' govuk-input--error' : ''
  const label = `<label class="govuk-label govuk-visually-hidden" for="${translation.name}">Welsh ${translation.label}</label>`
  const welsh = translation.welshContent
  if (translation.attributes?.textareaHeight) {
    const markdownHtml = translation.attributes.showMarkdownHelp
      ? markdownHelpHtml
      : ''
    return `${label}<textarea class="govuk-textarea${errorClass}" rows="${translation.attributes.textareaHeight}" lang="cy" name="${translation.name}" id="${translation.name}">${welsh}</textarea>${markdownHtml}`
  }

  return `${label}<input type="text" lang="cy" class="govuk-input${errorClass}" name="${translation.name}" id="${translation.name}" value="${welsh}"/>`
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 */
export function buildTranslationRows(metadata, definition, validation) {
  const translationsJSON = /** @type {Record<string, string>} */ (
    // @ts-expect-error - dynamic language definition
    definition.metadata?.translations?.cy
  )

  const allSections = buildOverviewSection(
    metadata,
    definition,
    translationsJSON,
    validation
  )

  // Add separator
  allSections.push({ title: '', table: [] })

  for (const page of definition.pages) {
    const components = hasComponents(page) ? page.components : []
    if (components.length) {
      allSections.push(buildPageSection(page, definition, translationsJSON, validation))
      for (const component of components) {
        if (component.type === ComponentType.Markdown) {
          continue
        }
        allSections.push(
          buildComponentSection(page, component, definition, translationsJSON, validation)
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
  const errorSummary = errorList

  const rows = buildTranslationRows(metadata, definition, validation)

  const fieldTables = rows.map((section) => ({
    caption: section.title,
    captionClasses: 'govuk-table__caption--m',
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
          html: `<div class="govuk-form-group">${buildTranslationHtml(translation, markdownHelpHtml, errorList)}</div`,
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
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 * @import { Translation, TranslationAttributes } from '~/src/models/forms/editor-v2/translations-config.js'
 */
