import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ListConflicts} listConflicts
 * @param {{ backText: string, backUrl: string }} backLink
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function editListResolveViewModel(
  metadata,
  definition,
  listConflicts,
  backLink,
  notification,
  validation
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  return {
    backLink: {
      href: editorv2Path(metadata.slug, backLink.backUrl),
      text: backLink.backText
    },
    pageTitle: metadata.title,
    useNewMasthead: true,
    navigation,
    pageHeading: {
      text: metadata.title,
      size: 'large'
    },
    conflicts: listConflicts,
    errorList: buildErrorList(validation?.formErrors),
    notification
  }
}

/**
 * @import { FormDefinition, FormEditor, FormMetadata, ListConflicts } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
