import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * The advanced settings available on a form, one per row.
 * @param {string} slug
 */
export function buildSettingsTable(slug) {
  const linkClasses = 'govuk-link govuk-link--no-visited-state'

  return {
    firstCellIsHeader: false,
    rows: [
      [
        {
          html: '<span class="govuk-!-font-weight-bold">Email actions</span>'
        },
        { text: 'Configure email recipients of this submitted form' },
        {
          html: `<a class="${linkClasses}" href="${editorv2Path(slug, 'email-actions')}">Change<span class="govuk-visually-hidden"> email actions</span></a>`
        }
      ]
    ]
  }
}

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
    },
    settingsTable: buildSettingsTable(metadata.slug)
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
