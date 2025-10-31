import { type ConditionListItemRefValueDataV2 } from '~/src/conditions/types.js'
import { type FormDefinition } from '~/src/form/form-definition/types.js'

/**
 * TypeGuard to check if something is a FormDefinition
 * @param { unknown } definition
 * @returns { definition is FormDefinition }
 */
export function isFormDefinition(
  definition: unknown
): definition is FormDefinition {
  if (!definition) {
    return false
  }

  return (
    typeof definition === 'object' &&
    'name' in definition &&
    'pages' in definition &&
    'conditions' in definition
  )
}

/**
 * TypeGuard to check if something is a ConditionListItemRefValueDataV2
 * @param { unknown } conditionValueData
 * @returns { definition is ConditionListItemRefValueDataV2 }
 */
export function isConditionListItemRefValueData(
  conditionValueData: unknown
): conditionValueData is ConditionListItemRefValueDataV2 {
  if (!conditionValueData) {
    return false
  }

  return (
    typeof conditionValueData === 'object' &&
    'listId' in conditionValueData &&
    'itemId' in conditionValueData
  )
}
