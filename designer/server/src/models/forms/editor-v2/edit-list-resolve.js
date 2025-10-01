import { closest } from 'fastest-levenshtein'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param { ComponentDef | undefined } question
 * @param {ListConflict[]} listConflicts
 * @param {{ backText: string, backUrl: string }} backLink
 * @param {string[]} [notification]
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function editListResolveViewModel(
  metadata,
  definition,
  question,
  listConflicts,
  backLink,
  notification,
  validation
) {
  const title = 'Resolve issues in your list'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const listConflictsWithMatches = listConflicts.map((conf) => {
    const closestMatch = closest(
      conf.conflictItem.text,
      conf.linkableItems.map((x) => x.text)
    )
    return {
      ...conf,
      closestMatch
    }
  })

  const sortedConflicts = listConflictsWithMatches.toSorted(
    (conflictA, conflictB) =>
      conflictA.conflictItem.text.localeCompare(conflictB.conflictItem.text)
  )

  return {
    backLink: {
      href: editorv2Path(metadata.slug, backLink.backUrl),
      text: backLink.backText
    },
    pageTitle: `${title} - ${metadata.title}`,
    useNewMasthead: true,
    navigation,
    pageHeading: {
      text: title,
      size: 'large'
    },
    pageCaption: {
      text: metadata.title
    },
    question,
    conflicts: sortedConflicts,
    errorList: buildErrorList(validation?.formErrors),
    notification
  }
}

/**
 * @import { ComponentDef, FormDefinition, FormEditor, FormMetadata, ListConflict } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
