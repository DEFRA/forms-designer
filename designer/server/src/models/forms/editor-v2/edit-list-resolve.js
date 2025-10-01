import levenshtein from 'js-levenshtein'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Find the nearest text match to auto-select the most likely changed item
 * @param {{ id: string, text: string }} item
 * @param {{ id?: string, text: string, value: string | number | boolean }[]} possibleItems
 */
export function findClosestMatch(item, possibleItems) {
  let closest = {
    distance: 1000,
    item: possibleItems[0]
  }
  possibleItems.forEach((poss) => {
    const distance = levenshtein(
      item.text.toLowerCase(),
      poss.text.toLowerCase()
    )
    if (distance < closest.distance) {
      closest = {
        distance,
        item: poss
      }
    }
  })
  return closest
}

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
    const closestMatch = findClosestMatch(conf.conflictItem, conf.linkableItems)
      .item.value
    return {
      ...conf,
      closestMatch
    }
  })

  const sortedConflicts = listConflictsWithMatches.sort(
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
