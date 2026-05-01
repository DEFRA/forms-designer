/**
 * @param {ConditionalAmountState[] | undefined} items
 * @param {string} id
 * @returns {ConditionalAmountState | undefined}
 */
export function findConditionalAmountById(items, id) {
  return items?.find((item) => item.id === id)
}

/**
 * @param {ConditionalAmountState[]} items
 * @param {string} id
 * @returns {ConditionalAmountState[]}
 */
export function removeConditionalAmountById(items, id) {
  return items.filter((item) => item.id !== id)
}

/**
 * @param {ConditionalAmountState[]} items
 * @param {ConditionalAmountState} entry
 * @returns {ConditionalAmountState[]}
 */
export function upsertConditionalAmount(items, entry) {
  const idx = items.findIndex((item) => item.id === entry.id)
  if (idx === -1) {
    return [...items, entry]
  }
  const next = [...items]
  next[idx] = entry
  return next
}

/**
 * @param {ConditionalAmountState | undefined} item
 * @param {boolean} expanded
 * @returns {ConditionalAmountEditRow}
 */
export function setConditionalAmountEditState(item, expanded) {
  return {
    expanded,
    id: item?.id ?? '',
    amount: item?.amount ?? '',
    condition: item?.condition ?? ''
  }
}

/**
 * @param {string} conditionId
 * @param {Array<{ id: string, displayName: string, expression?: string }>} conditions
 * @returns {{ displayName: string, expression: string }}
 */
export function formatConditionForTile(conditionId, conditions) {
  const match = conditions.find((c) => c.id === conditionId)
  if (!match) {
    return { displayName: conditionId, expression: '' }
  }
  return {
    displayName: match.displayName,
    expression: match.expression ?? ''
  }
}

/**
 * @import { ConditionalAmountEditRow, ConditionalAmountState } from '@defra/forms-model'
 */
