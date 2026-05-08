import { randomUUID } from 'node:crypto'

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
 * Merge `state.conditionalAmounts` onto `questionDetails.options.conditionalAmounts`
 * for PaymentField components. Strips the `id` field (it's a session-only handle).
 * Returns the original questionDetails unchanged when there's nothing to write
 * (non-PaymentField, no state, empty list).
 * @template {Partial<ComponentDef>} T
 * @param {T} questionDetails
 * @param {QuestionSessionState | undefined} state
 * @returns {T}
 */
export function mergeConditionalAmountsIntoOptions(questionDetails, state) {
  if (questionDetails.type !== 'PaymentField') {
    return questionDetails
  }
  const items = state?.conditionalAmounts ?? []
  if (items.length === 0) {
    return questionDetails
  }
  return /** @type {T} */ ({
    ...questionDetails,
    options: {
      ...(questionDetails.options ?? {}),
      conditionalAmounts: items.map(({ amount, condition }) => ({
        amount,
        condition
      }))
    }
  })
}

/**
 * Idempotently seed `state.conditionalAmounts` from a PaymentField component's
 * existing `options.conditionalAmounts`. Each entry gets a fresh stable id used
 * for the editor's edit/remove links. The guard is `state.conditionalAmounts ===
 * undefined`: an existing empty array (user removed everything in this session)
 * is preserved, so we don't repopulate over an intentional empty state.
 * @param {Partial<ComponentDef> | undefined} component
 * @param {QuestionSessionState} state
 * @returns {QuestionSessionState}
 */
export function hydrateConditionalAmountsFromComponent(component, state) {
  if (!component || component.type !== 'PaymentField') {
    return state
  }
  if (state.conditionalAmounts !== undefined) {
    return state
  }
  const options =
    /** @type {{ conditionalAmounts?: Array<{ amount: number, condition: string }> }} */ (
      component.options ?? {}
    )
  const fromOptions = options.conditionalAmounts ?? []
  return {
    ...state,
    conditionalAmounts: fromOptions.map((entry) => ({
      id: randomUUID(),
      amount: entry.amount,
      condition: entry.condition
    }))
  }
}

/**
 * @import { ComponentDef } from '@defra/forms-model'
 * @import { ConditionalAmountEditRow, ConditionalAmountState, QuestionSessionState } from '@defra/forms-model'
 */
