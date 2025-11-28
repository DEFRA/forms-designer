import { getPageTitle, isConditionWrapperV2 } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import {
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum
} from '~/src/models/forms/editor-v2/common.js'
import {
  buildConditionEditor,
  getComponentsPerPageNumber
} from '~/src/models/forms/editor-v2/condition-helper.js'
import {
  getPageConditionDetails,
  getReferencedComponentNamesV2
} from '~/src/models/forms/editor-v2/condition-helpers.js'
import {
  determineEditUrl,
  isGuidancePage
} from '~/src/models/forms/editor-v2/pages.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Gets filtered and sorted V2 conditions
 * @param {FormDefinition} definition
 * @returns {ConditionWrapperV2[]}
 */
export function getConditionsData(definition) {
  return definition.conditions
    .filter(isConditionWrapperV2)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

/**
 * Construct a list of applicable conditions i.e. those whose referenced questions are all from previous pages
 * @param {FormDefinition} definition
 * @param {ConditionWrapperV2[]} allConditions
 * @param {number} currentPageNum
 * @returns {ConditionWrapperV2[]}
 */
export function getPreceedingConditions(
  definition,
  allConditions,
  currentPageNum
) {
  // Create a map of what components reside on what page
  /** @type {Map<string, number>} */
  const componentPage = new Map()
  for (const { number, components } of getComponentsPerPageNumber(definition)) {
    for (const component of components) {
      componentPage.set(component.name, number)
    }
  }

  if (componentPage.size === 0) {
    return []
  }

  // Find the latest page of where a condition's components are
  const conds = allConditions.map((cond) => {
    const pages = getReferencedComponentNamesV2(cond, definition).map(
      (x) => componentPage.get(x) ?? 0
    )
    return {
      maxPageNum: Math.max(...pages),
      condition: cond
    }
  })

  // Return conditions where all related questions are on preceding pages
  return conds
    .filter((cond) => cond.maxPageNum < currentPageNum)
    .map((x) => x.condition)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function getBaseDetails(metadata, definition, pageId) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const page = getPageFromDefinition(definition, pageId)
  const pageNum = getPageNum(definition, pageId)
  const conditionDetails = getPageConditionDetails(definition, pageId)
  return {
    navigation,
    page,
    pageNum,
    conditionDetails
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ConditionSessionState} state
 * @param {{ creating?: boolean }} options
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function pageConditionsViewModel(
  metadata,
  definition,
  pageId,
  state,
  options,
  validation,
  notification
) {
  const { navigation, page, pageNum, conditionDetails } = getBaseDetails(
    metadata,
    definition,
    pageId
  )
  const allConditions = getConditionsData(definition)
  const allPrecedingConditions = getPreceedingConditions(
    definition,
    allConditions,
    pageNum
  )
  const errorList = buildErrorList(validation?.formErrors)

  const cardTitle = `Page ${pageNum}`
  const title = getPageTitle(/** @type {Page} */ (page))
  const cardCaption =
    title && title !== '' ? `Page ${pageNum}: ${title}` : cardTitle
  const formTitle = metadata.title
  const pageTitle = `${cardTitle} - ${formTitle}`

  const pageSpecificHeading = cardCaption

  const baseUrl = editorv2Path(metadata.slug, `page/`)
  const pageUrl = `${baseUrl}${pageId}`

  const backUrl = determineEditUrl(/** @type {Page} */ (page), false, baseUrl)

  const backLink = {
    href: backUrl,
    text: isGuidancePage(/** @type {Page} */ (page))
      ? 'Back to guidance'
      : 'Back to questions'
  }

  const conditionsManagerPath = editorv2Path(metadata.slug, 'conditions')
  const pageConditionsApiUrl = editorv2Path(
    metadata.slug,
    `page/${pageId}/conditions/assign`
  )

  return {
    ...baseModelFields(metadata.slug, pageTitle, formTitle),
    formSlug: metadata.slug,
    pageId,
    cardTitle,
    cardCaption,
    pageSpecificHeading,
    navigation,
    backLink,
    currentTab: 'conditions',
    pageTitle: cardCaption,
    baseUrl: pageUrl,
    notification,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    pageCondition: conditionDetails.pageCondition,
    pageConditionDetails: conditionDetails.pageConditionDetails,
    pageConditionPresentationString:
      conditionDetails.pageConditionPresentationString,
    allConditions,
    allPrecedingConditions,
    conditionsManagerPath,
    pageConditionsApiUrl,
    conditionEditor: {
      ...buildConditionEditor(definition, validation, state),
      allowComplexConditions: false
    },
    ...options
  }
}

/**
 * @import { ConditionSessionState, ConditionWrapperV2, FormDefinition, FormMetadata, Page } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
