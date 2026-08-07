import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * View model for the form-level advanced settings page
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function advancedSettingsViewModel(metadata, definition) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageHeading = 'Advanced settings'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'pages'),
      text: 'Back to pages'
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageHeading
    },
    pageCaption: {
      text: pageCaption
    }
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
