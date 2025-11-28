import { getPageTitle } from '@defra/forms-model'

import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { toPresentationHtmlV2 } from '~/src/models/forms/editor-v2/condition-helpers.js'
import { isJoinedCondition } from '~/src/models/forms/editor-v2/conditions-join-helper.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 * @param {string} conditionId
 */
export function getImpactedPages(definition, conditionId) {
  const pages = definition.pages.filter(
    (page) => page.condition === conditionId
  )
  return pages
    .map((page) => {
      const index = /** @type {number} */ (
        definition.pages.findIndex((innerPage) => innerPage.id === page.id)
      )

      return {
        pageNum: index + 1,
        pageTitle: getPageTitle(page)
      }
    })
    .map((x) => `Page ${x.pageNum}: ${x.pageTitle}`)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionWrapperV2} originalCondition
 * @param { ConditionSessionState | null | undefined } state
 * @param {string} conditionId
 */
export function conditionCheckChangesViewModel(
  metadata,
  definition,
  originalCondition,
  state,
  conditionId
) {
  const formSlug = metadata.slug
  const formPath = formOverviewPath(formSlug)
  const navigation = getFormSpecificNavigation(formPath, metadata, definition)
  const pageHeading = 'Manage conditions'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const warningItems = getImpactedPages(definition, conditionId)

  const isJoined = isJoinedCondition(originalCondition)
  const editorPath = isJoined
    ? `conditions-join/${conditionId}`
    : `condition/${conditionId}/${state?.stateId}`

  return {
    backLink: {
      href: editorFormPath(metadata.slug, 'conditions'),
      text: 'Back to conditions'
    },
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    useNewMasthead: true,
    formSlug,
    navigation,
    pageCaption: {
      text: pageCaption
    },
    originalCondition: {
      name: originalCondition.displayName,
      html: toPresentationHtmlV2(originalCondition, definition)
    },
    newCondition: {
      name: state?.conditionWrapper?.displayName,
      html: state?.conditionWrapper
        ? toPresentationHtmlV2(state.conditionWrapper, definition)
        : ''
    },
    warningItems,
    continueEditingPath: editorFormPath(metadata.slug, editorPath)
  }
}

/**
 * @import { ConditionSessionState, FormMetadata, FormDefinition, ConditionWrapperV2, Page } from '@defra/forms-model'
 */
