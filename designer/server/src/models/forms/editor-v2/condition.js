import {
  ConditionsModel,
  FormStatus,
  convertConditionWrapperFromV2,
  hasComponentsEvenIfNoNext,
  hasConditionSupport,
  hasFormField,
  isConditionWrapperV2,
  isFormType
} from '@defra/forms-model'

import {
  BACK_TO_MANAGE_CONDITIONS,
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string} slug
 * @param {FormDefinition} definition
 */
export function buildConditionEditor(definition, legendText, condition, pageId) {
  const sourceId = 'componentId'
  const sourceLabel = 'Select a question'
  const pages = definition.pages.map((page, index) => ({ page, number: index + 1 }))
  const sourceItems = pages
    .filter(
      ({ page }) =>
        hasComponentsEvenIfNoNext(page) &&
        page.components.some(hasConditionSupport)
    )
    .map(({ page, number }) => {
      const components = hasComponentsEvenIfNoNext(page)
        ? page.components.filter(hasConditionSupport)
        : []

      return {
        page,
        number,
        components,
        group: components.length > 1
      }
    })

  return {
    legendText,
    source: {
      id: sourceId,
      name: sourceId,
      label: {
        text: sourceLabel
      },
      items: sourceItems
    },
    operator: {},
    value: {}
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionWrapperV2} [condition]
 * @param {string[]} [notification]
 */
export function conditionViewModel(
  metadata,
  definition,
  condition,
  notification
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)
  const pageHeading = `${condition ? 'Edit' : 'Create new'} condition`
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'conditions'),
      text: BACK_TO_MANAGE_CONDITIONS
    },
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    useNewMasthead: true,
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    notification,
    conditionEditor: buildConditionEditor(definition, pageHeading)
  }
}

/**
 * @import { FormMetadata, FormDefinition, RuntimeFormModel, ConditionWrapperV2 } from '@defra/forms-model'
 */
