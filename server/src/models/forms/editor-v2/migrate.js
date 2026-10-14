import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} formDefinition
 */
export function migrateConfirmationPageViewModel(metadata, formDefinition) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    formDefinition,
    'Editor'
  )
  const pageTitle = 'Are you sure you want to switch to the new editor?'

  return {
    ...baseModelFields(metadata.slug, `${pageTitle} - ${formTitle}`, formTitle),
    navigation,
    pageHeading: {
      text: metadata.title
    },
    bodyHeadingText: pageTitle,
    bodyWarning: {
      text: "You won't be able to use the old editor for this form after switching."
    },
    buttons: [
      {
        text: 'Switch to new editor',
        classes: 'govuk-button--primary'
      },
      {
        href: formPath,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
