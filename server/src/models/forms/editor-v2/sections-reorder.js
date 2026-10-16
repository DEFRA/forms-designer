import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { orderItems } from '~/src/models/forms/editor-v2/pages-helper.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 * @param {string} sectionOrder
 * @param {{ button: string | undefined, itemId: string | undefined} | undefined} focus
 */
export function mapSectionData(definition, sectionOrder, focus) {
  if (!definition.sections.length) {
    return definition
  }

  const orderedSections = orderItems(definition.sections, sectionOrder)

  return {
    ...definition,
    sections: orderedSections.map((section) => {
      return {
        ...section,
        isFocus: focus?.itemId === section.id,
        prevFocusDirection: focus?.button
      }
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} sectionOrder
 * @param {{ button: string | undefined, itemId: string | undefined } | undefined } focus
 */
export function sectionsReorderViewModel(
  metadata,
  definition,
  sectionOrder,
  focus
) {
  const formTitle = metadata.title
  const pageHeading = 'Re-order sections'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageActions = [
    {
      name: 'saveChanges',
      text: 'Save changes',
      classes: 'govuk-button--inverse',
      value: 'true',
      type: 'submit'
    }
  ]

  const model = {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      pageHeading
    ),
    ...mapSectionData(definition, sectionOrder, focus),
    formSlug: metadata.slug,
    navigation,
    pageCaption: {
      text: definition.name
    },
    pageDescription: {
      text: 'Use the up and down buttons or drag and drop sections to re-order them.'
    },
    pageActions,
    itemOrder: sectionOrder
  }
  return model
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
