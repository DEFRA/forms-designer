import {
  ConditionsModel,
  convertConditionWrapperFromV2,
  hasComponentsEvenIfNoNext,
  isConditionWrapperV2
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import {
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum
} from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Gets page condition details and presentation string
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns {{ pageCondition: string | undefined, pageConditionDetails: ConditionWrapperV2 | undefined, pageConditionPresentationString: string | null }}
 */
export function getPageConditionDetails(definition, pageId) {
  const page = getPageFromDefinition(definition, pageId)
  const pageCondition = page?.condition
  const pageConditionDetails = pageCondition
    ? /** @type {ConditionWrapperV2 | undefined} */ (
        definition.conditions
          .filter(isConditionWrapperV2)
          .find((c) => c.id === pageCondition)
      )
    : undefined

  let pageConditionPresentationString = null
  if (pageConditionDetails) {
    const { pages, conditions, lists } = definition
    const components = pages.flatMap((p) =>
      hasComponentsEvenIfNoNext(p) ? p.components : []
    )

    const v2Conditions = /** @type {ConditionWrapperV2[]} */ (
      conditions.filter(isConditionWrapperV2)
    )

    /** @type {RuntimeFormModel} */
    const accessors = {
      getListById: (listId) => lists.find((list) => list.id === listId),
      getComponentById: (componentId) =>
        components.find((component) => component.id === componentId),
      getConditionById: (conditionId) =>
        v2Conditions.find((condition) => condition.id === conditionId)
    }

    const conditionAsV1 = convertConditionWrapperFromV2(
      /** @type {ConditionWrapperV2} */ (pageConditionDetails),
      accessors
    )
    pageConditionPresentationString = ConditionsModel.from(
      conditionAsV1.value
    ).toPresentationString()
  }

  return {
    pageCondition,
    pageConditionDetails,
    pageConditionPresentationString
  }
}

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
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function pageConditionsViewModel(
  metadata,
  definition,
  pageId,
  validation,
  notification
) {
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
  const allConditions = getConditionsData(definition)
  const errorList = buildErrorList(validation?.formErrors)

  const pageHeading = `Page ${pageNum}: ${page?.title ?? 'Untitled page'}`
  const pageTitle = `Page conditions - ${metadata.title}`
  const cardTitle = `Page ${pageNum} overview`
  const cardCaption = `Page ${pageNum}`

  const backLink = {
    href: editorv2Path(metadata.slug, `page/${pageId}/questions`),
    text: 'Back to questions'
  }

  const conditionsManagerPath = editorv2Path(metadata.slug, 'conditions')
  const pageConditionsApiUrl = editorv2Path(
    metadata.slug,
    `page/${pageId}/conditions`
  )

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    pageId,
    cardTitle,
    cardCaption,
    navigation,
    backLink,
    currentTab: 'conditions',
    pageTitle: cardCaption,
    baseUrl: editorv2Path(metadata.slug, `page/${pageId}`),
    notification,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    pageCondition: conditionDetails.pageCondition,
    pageConditionDetails: conditionDetails.pageConditionDetails,
    pageConditionPresentationString:
      conditionDetails.pageConditionPresentationString,
    allConditions,
    conditionsManagerPath,
    pageConditionsApiUrl
  }
}

/**
 * @import { FormDefinition, ConditionWrapperV2, FormMetadata, RuntimeFormModel } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
