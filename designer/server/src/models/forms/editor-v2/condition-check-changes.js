import {
  getFormSpecificNavigation,
  toPresentationHtmlV2
} from '~/src/models/forms/editor-v2/common.js'
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
    .map((page) => ({
      pageNum:
        definition.pages.findIndex((innerPage) => innerPage.id === page.id) + 1,
      pageTitle: page.title
    }))
    .map((x) => `Page ${x.pageNum}: ${x.pageTitle}`)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ConditionWrapperV2} originalCondition
 * @param { ConditionSessionState | undefined } state
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
      html: toPresentationHtmlV2(
        state?.conditionWrapper ?? /** @type {ConditionWrapperV2} */ ({}),
        definition
      )
    },
    warningItems,
    continueEditingPath: editorFormPath(
      metadata.slug,
      `condition/${conditionId}/${state?.stateId}`
    )
  }
}

/**
 * @import { ConditionSessionState, FormMetadata, FormDefinition, ConditionWrapperV2 } from '@defra/forms-model'
 */
