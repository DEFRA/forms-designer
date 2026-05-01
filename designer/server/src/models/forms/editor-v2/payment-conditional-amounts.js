import { isConditionWrapperV2 } from '@defra/forms-model'

import { formatCurrency } from '~/src/common/nunjucks/filters/format-currency.js'
import {
  formatConditionForTile,
  setConditionalAmountEditState
} from '~/src/lib/payment-conditional-amount-helpers.js'
import { toPresentationStringV2 } from '~/src/models/forms/editor-v2/condition-helpers.js'
import { getConditionsData } from '~/src/models/forms/editor-v2/page-conditions.js'

/**
 * @param {{ definition: FormDefinition, state: QuestionSessionState | undefined }} args
 */
export function getPaymentConditionalAmountsViewModel({ definition, state }) {
  const items = state?.conditionalAmounts ?? []

  const conditionsForLookup = definition.conditions
    .filter(isConditionWrapperV2)
    .map((c) => ({
      id: c.id,
      displayName: c.displayName,
      expression: toPresentationStringV2(c, definition)
    }))

  const tiles = items.map((entry, index) => {
    const info = formatConditionForTile(entry.condition, conditionsForLookup)
    return {
      index: index + 1,
      id: entry.id,
      amount: entry.amount,
      amountFormatted: formatCurrency(entry.amount),
      conditionId: entry.condition,
      conditionDisplayName: info.displayName,
      conditionExpression: info.expression
    }
  })

  const conditionsForDropdown = getConditionsData(definition).map((c) => ({
    value: c.id,
    text: c.displayName
  }))

  const editRow =
    state?.conditionalAmountEditRow ??
    setConditionalAmountEditState(undefined, false)

  let editRowIndex = 0
  if (editRow.expanded) {
    if (editRow.id) {
      const idx = items.findIndex((i) => i.id === editRow.id)
      editRowIndex = idx >= 0 ? idx + 1 : items.length + 1
    } else {
      editRowIndex = items.length + 1
    }
  }

  return { tiles, conditionsForDropdown, editRow, editRowIndex }
}

/**
 * @import { FormDefinition, QuestionSessionState } from '@defra/forms-model'
 */
