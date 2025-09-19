import { isConditionWrapperV2 } from '@defra/forms-model'

/**
 * Find all pages that reference a condition
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @returns {{ pages: Array<{ pageId: string, pageNumber: number, pageTitle: string }>, conditions: Array<{ conditionId: string, conditionName: string }> }}
 */
export function findConditionReferences(definition, conditionId) {
  const { pages, conditions } = definition

  const pagesUsingCondition = pages
    .map((page, index) => ({
      page,
      pageNumber: index + 1,
      pageId: page.id ?? '',
      pageTitle: page.title || `Page ${index + 1}`
    }))
    .filter(({ page }) => page.condition === conditionId)
    .map(({ pageId, pageNumber, pageTitle }) => ({
      pageId,
      pageNumber,
      pageTitle
    }))

  const conditionsReferencingThis = conditions
    .filter(isConditionWrapperV2)
    .filter((condition) =>
      condition.items.some(
        (item) => 'conditionId' in item && item.conditionId === conditionId
      )
    )
    .map((condition) => ({
      conditionId: condition.id,
      conditionName: condition.displayName
    }))

  return {
    pages: pagesUsingCondition,
    conditions: conditionsReferencingThis
  }
}

/**
 * Find conditions that reference any of the supplied component IDs
 * @param {FormDefinition} definition
 * @param {Set<string>} componentIds
 */
export function findConditionsReferencingComponents(definition, componentIds) {
  /** @type {ConditionWrapperV2[]} */
  const matchedConditions = []
  const matchedComponentIds = new Set()

  if (componentIds.size === 0) {
    return { conditions: matchedConditions, componentIds: matchedComponentIds }
  }

  for (const condition of definition.conditions) {
    if (!isConditionWrapperV2(condition)) {
      continue
    }

    let hasMatch = false

    for (const item of condition.items) {
      if (
        'componentId' in item &&
        item.componentId &&
        componentIds.has(item.componentId)
      ) {
        matchedComponentIds.add(item.componentId)
        hasMatch = true
      }
    }

    if (hasMatch) {
      matchedConditions.push(condition)
    }
  }

  return { conditions: matchedConditions, componentIds: matchedComponentIds }
}

/**
 * @import { FormDefinition } from '@defra/forms-model'
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
