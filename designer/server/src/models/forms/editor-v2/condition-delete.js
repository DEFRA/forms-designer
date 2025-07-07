import { getConditionV2 } from '@defra/forms-model'

import { findConditionReferences } from '~/src/lib/condition-references.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent delete condition confirmation page
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} conditionId
 */
export function deleteConditionConfirmationPageViewModel(
  metadata,
  definition,
  conditionId
) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const condition = getConditionV2(definition, conditionId)
  const { pages, conditions } = findConditionReferences(definition, conditionId)

  const hasReferences = pages.length > 0 || conditions.length > 0
  const pageHeading = 'Are you sure you want to delete this condition?'
  const pageTitle = `${pageHeading} - ${formTitle}`

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    navigation,
    bodyCaptionText: `Condition: ${condition.displayName}`,
    bodyHeadingText: pageHeading,
    bodyWarning: hasReferences
      ? {
          html: `Deleting this condition will affect the following pages:<ul class="govuk-list govuk-list--bullet">
        ${pages.map((page) => `<li>Page ${page.pageNumber}</li>`).join('')}
      </ul>`
        }
      : null,
    buttons: [
      {
        text: 'Delete condition',
        classes: 'govuk-button--warning'
      },
      {
        href: editorFormPath(metadata.slug, 'conditions'),
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
