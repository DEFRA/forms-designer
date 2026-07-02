import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponents
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { buildPreviewUrl } from '~/src/models/forms/editor-v2/preview-helpers.js'
import { formOverviewPath } from '~/src/models/links.js'

// List of fields that require more than question, hint and short description
const COMPLEX_FIELDS = [
  ComponentType.AutocompleteField,
  ComponentType.CheckboxesField,
  ComponentType.DeclarationField,
  ComponentType.RadiosField,
  ComponentType.YesNoField
]

const IGNORE_FIELDS = [ComponentType.Details]

/**
 * @param {string} key
 * @param {Record<string, string>} translations
 */
function lookupTranslation(key, translations) {
  return translations[key] ?? ''
}

/**
 * @param {Page} page
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 */
function buildPageSection(page, definition, translations) {
  const pageId = /** @type {string} */ (page.id)
  return {
    title: `Page ${getPageNum(definition, pageId)}`,
    table: buildPage(page, translations)
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
  return {
    title: `Page ${getPageNum(definition, pageId)}, question ${getQuestionNum(definition, pageId, componentId)}`,
    table: buildComponent(component, translations)
  }
}

/**
 * @param {Page} page
 * @param {Record<string, string>} translations
 */
function buildPage(page, translations) {
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
      welshContent: lookupTranslation(`pages.${page.id}.title`, translations)
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
      )
    })
  }

  return pageRows
}

/**
 * @param {ComponentDef} component
 * @param {Record<string, string>} translations
 */
function buildComponent(component, translations) {
  if (IGNORE_FIELDS.includes(component.type)) {
    return []
  }

  const fields = []

  if (!COMPLEX_FIELDS.includes(component.type)) {
    const typed = /** @type {InputFieldsComponentsDef} */ (component)
    if (typed.title) {
      fields.push({
        name: `components.${component.id}.title`,
        contentType: 'Question text',
        englishContent: typed.title,
        welshContent: lookupTranslation(
          `components.${component.id}.title`,
          translations
        )
      })
    }
    if (typed.hint) {
      fields.push({
        name: `components.${component.id}.hint`,
        contentType: 'Hint',
        englishContent: typed.hint,
        welshContent: lookupTranslation(
          `components.${component.id}.hint`,
          translations
        )
      })
    }
    fields.push({
      name: `components.${component.id}.shortDescription`,
      contentType: 'Short description',
      englishContent: typed.shortDescription,
      welshContent: lookupTranslation(
        `components.${component.id}.shortDescription`,
        translations
      )
    })
  }
  return fields
}

/**
 * @param {{ name: string, contentType: string, englishContent: string | undefined, welshContent: string }} translation
 */
function buildTranslationHtml(translation) {
  if (translation.contentType === 'Hint') {
    return `<textarea class="govuk-textarea" rows="3" lang="cy" name="${translation.name}" id="${translation.name}">${translation.welshContent}</textarea>`
  }

  if (translation.contentType === 'Guidance text') {
    return `<textarea class="govuk-textarea" rows="6" lang="cy" name="${translation.name}" id="${translation.name}">${translation.welshContent}</textarea>`
  }

  return `<div class="govuk-form-group"><input type="text" lang="cy" class="govuk-input" name="${translation.name}" id="${translation.name}" value="${translation.welshContent}"/></div>`
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function buildTranslationsTables(metadata, definition) {
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

  return allSections.map((section) => ({
    caption: section.title,
    firstCellIsHeader: false,
    head: section.table.length
      ? [{ text: '' }, { text: 'English content' }, { text: 'Welsh content' }]
      : {},
    classes: 'app-translation-table',
    rows: section.table.map((translation) => {
      return [
        {
          text: translation.contentType,
          classes: 'govuk-table__header'
        },
        {
          text: translation.englishContent
        },
        {
          html: buildTranslationHtml(translation)
        }
      ]
    })
  }))
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function translationsViewModel(
  metadata,
  definition,
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

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList,
    notification,
    fieldTables: buildTranslationsTables(metadata, definition)
  }
}

/**
 * @import { ComponentDef, InputFieldsComponentsDef, FormMetadata, FormDefinition, Page, PageQuestion } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
