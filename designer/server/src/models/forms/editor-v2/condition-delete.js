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
  const { pages, conditions, paymentFields } = findConditionReferences(
    definition,
    conditionId
  )

  const hasPaymentReferences = paymentFields.length > 0
  const hasReferences =
    pages.length > 0 || conditions.length > 0 || hasPaymentReferences
  const pageHeading = formTitle
  const bodyHeadingText = 'Are you sure you want to delete this condition?'
  const pageTitle = `${pageHeading} - ${formTitle}`

  const affectedPages = (() => {
    const seen = new Set()
    /** @type {Array<{ pageId: string, pageNumber: number, pageTitle: string }>} */
    const merged = []
    for (const ref of [...pages, ...paymentFields]) {
      if (!seen.has(ref.pageNumber)) {
        seen.add(ref.pageNumber)
        merged.push(ref)
      }
    }
    return merged.sort((a, b) => a.pageNumber - b.pageNumber)
  })()

  const introText = hasPaymentReferences
    ? 'Deleting this condition will affect payments and the following pages:'
    : 'Deleting this condition will affect the following pages:'

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    navigation,
    bodyCaptionText: `Condition: ${condition.displayName}`,
    bodyHeadingText,
    bodyWarning: hasReferences
      ? {
          html: `${introText}<ul class="govuk-list govuk-list--bullet">
        ${affectedPages.map((page) => `<li>Page ${page.pageNumber}</li>`).join('')}
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
