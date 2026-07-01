import { ComponentType, FormStatus, hasComponents, isConditionWrapperV2 } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { buildPreviewUrl } from '~/src/models/forms/editor-v2/preview-helpers.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {ComponentDef} component
 * @param {Record<string, string>} translations
 */
function buildComponent(component, translations) {
  /**
   * @param {string} key
   */
  function lookupTranslation(key) {
    return translations[key] ?? ''
  }

  if (component.type === ComponentType.TextField) {
    return [
      {
        name: `component.${component.id}.title`,
        contentType: 'Question text',
        englishContent: component.title,
        welshContent: lookupTranslation(`components.${component.id}.title`)
      },
      {
        name: `component.${component.id}.hint`,
        contentType: 'Hint',
        englishContent: component.hint,
        welshContent: lookupTranslation(`components.${component.id}.hint`)
      },
      {
        name: `component.${component.id}.shortDescription`,
        contentType: 'Short description',
        englishContent: component.shortDescription,
        welshContent: lookupTranslation(`components.${component.id}.shortDescription`)
      }
    ]
  }
  return []
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function buildTranslationsTable(metadata, definition) {
  // @ts-expect-error - dynamic language definition
  const translationsJSON = /** @type {Record<string, string>} */ (definition.metadata?.translations?.cy)
  const allFields = definition.pages.flatMap(page => hasComponents(page) ? page.components.flatMap(comp => buildComponent(comp, translationsJSON)) : [])
  return {
    firstCellIsHeader: false,
    classes: 'app-conditions-table',
    head: [{ text: '' }, { text: 'English content' }, { text: 'Welsh content' }],
    rows: allFields.map((translation) => {
      return [
        {
          html: `<span class="govuk-!-font-weight-bold">${translation.contentType}</span>`
        },
        {
          text: translation.englishContent,
          classes: 'govuk-!-width-one-quarter'
        },
        {
          html: `<div class="govuk-form-group"><input type="text" lang="cy" class="govuk-input" name="${translation.name}" id="${translation.name}" value="${translation.welshContent}"/></div>`
        }
      ]
    })
  }
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
    translationsTable: buildTranslationsTable(metadata, definition)
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
