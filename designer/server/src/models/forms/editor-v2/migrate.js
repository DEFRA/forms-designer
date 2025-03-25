import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 */
export function migrateConfirmationPageViewModel(metadata) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const pageTitle = 'Do you want to migrate this form to version 2?'

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    navigation,
    pageHeading: {
      text: metadata.title
    },
    bodyHeadingText: pageTitle,
    bodyText:
      'In order to use the new editor, this form needs to be migrated to version 2. <br><br> Migrating this form will mean it cannot be used within the old editor. This operation is irreversible.',
    buttons: [
      {
        text: 'Migrate',
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
 * @import { FormDefinition, FormMetadata } from '@defra/forms-model'
 */
