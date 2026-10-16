import { ComponentType, isConditionWrapperV2 } from '@defra/forms-model'

/**
 * Find all pages, conditions, payment fields and outputs that reference a condition
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @returns {{ pages: Array<{ pageId: string, pageNumber: number, pageTitle: string }>, conditions: Array<{ conditionId: string, conditionName: string }>, paymentFields: Array<{ pageId: string, pageNumber: number, pageTitle: string, componentId: string }>, outputs: Array<{ index: number, emailAddress: string, audience: OutputAudience, version: string }> }}
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

  const paymentFields = pages.flatMap((page, index) => {
    const components =
      /** @type {Array<{ id?: string, type?: string, options?: { conditionalAmounts?: Array<{ condition: string }> } }>} */ (
        'components' in page ? (page.components ?? []) : []
      )
    return components
      .filter((c) => c.type === ComponentType.PaymentField)
      .filter((c) =>
        (c.options?.conditionalAmounts ?? []).some(
          (entry) => entry.condition === conditionId
        )
      )
      .map((c) => ({
        pageId: page.id ?? '',
        pageNumber: index + 1,
        pageTitle: page.title || `Page ${index + 1}`,
        componentId: c.id ?? ''
      }))
  })

  // Email actions (`outputs`) hold the condition deciding whether submissions
  // are sent to that address. The index identifies the entry for removal.
  const outputsUsingCondition = (definition.outputs ?? [])
    .map((output, index) => ({ output, index }))
    .filter(({ output }) => output.condition === conditionId)
    .map(({ output, index }) => ({
      index,
      emailAddress: output.emailAddress,
      audience: output.audience,
      version: output.version
    }))

  return {
    pages: pagesUsingCondition,
    conditions: conditionsReferencingThis,
    paymentFields,
    outputs: outputsUsingCondition
  }
}

/**
 * @import { FormDefinition, OutputAudience } from '@defra/forms-model'
 */
