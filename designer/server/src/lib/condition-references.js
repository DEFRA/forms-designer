import { isConditionWrapperV2, isConditionalType } from '@defra/forms-model'

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
 * @param {ComponentDef} origQuestion
 * @param { ComponentType | undefined } newQuestionType
 * @param {FormDefinition} definition
 */
export function questionTypeChangeWillBreakCondition(
  origQuestion,
  newQuestionType,
  definition
) {
  const hasConditionAttached = definition.conditions.some((cond) =>
    /** @type {ConditionWrapperV2} */ (cond).items.some(
      (item) => 'componentId' in item && item.componentId === origQuestion.id
    )
  )
  return hasConditionAttached && !isConditionalType(newQuestionType)
}

/**
 * @import { ComponentDef, ComponentType, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 */
