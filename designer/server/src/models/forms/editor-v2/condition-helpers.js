import {
  ConditionsModel,
  convertConditionWrapperFromV2,
  hasComponentsEvenIfNoNext,
  isConditionWrapperV2
} from '@defra/forms-model'

import { getPageFromDefinition } from '~/src/lib/utils.js'

/**
 * Convert the condition to a V1 wrapper
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {ConditionWrapper} condition as V1
 */
export function getConditionAsV1(conditionWrapper, definition) {
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

  return convertConditionWrapperFromV2(conditionWrapper, accessors)
}

/**
 * Gets the presentation string for a V2 condition wrapper
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {string} The presentation string for the condition
 */
export function toPresentationStringV2(conditionWrapper, definition) {
  const conditionAsV1 = getConditionAsV1(conditionWrapper, definition)
  return ConditionsModel.from(conditionAsV1.value).toPresentationString()
}

/**
 * Gets the presentation HTML for a V2 condition wrapper
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {string} The presentation HTML for the condition
 */
export function toPresentationHtmlV2(conditionWrapper, definition) {
  const conditionAsV1 = getConditionAsV1(conditionWrapper, definition)
  return ConditionsModel.from(conditionAsV1.value).toPresentationHtml()
}

/**
 * Gets a list of all component names used in the supplied condition
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {string[]} list of component names
 */
export function getReferencedComponentNamesV2(conditionWrapper, definition) {
  const conditionAsV1 = getConditionAsV1(conditionWrapper, definition)
  return conditionAsV1.value.conditions
    .map((cond) => ('field' in cond ? cond.field.name : undefined))
    .filter((elem) => elem !== undefined)
}

/**
 * Gets page condition details and presentation string
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns {ConditionDetails}
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
    pageConditionPresentationString = toPresentationStringV2(
      pageConditionDetails,
      definition
    )
  }

  return {
    pageCondition,
    pageConditionDetails,
    pageConditionPresentationString
  }
}

/**
 * @import { ConditionDetails, ConditionWrapper, FormDefinition, ConditionWrapperV2, RuntimeFormModel } from '@defra/forms-model'
 */
