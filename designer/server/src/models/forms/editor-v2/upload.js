import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {{ formErrors?: any, formValues?: any }} [validation]
 */
export function uploadViewModel(metadata, definition, validation) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageHeading = 'Upload a form'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    form: metadata,
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
    errorList: buildErrorList(validation?.formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    uploadAction: editorv2Path(metadata.slug, 'upload'),
    downloadAction: `/library/${metadata.slug}/editor-v2/download`,
    currentFormData: JSON.stringify(definition, null, 2),
    formSlug: metadata.slug
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
