import { ComponentType } from '~/src/components/enums.js'
import { type ConditionListItemRefValueDataV2 } from '~/src/conditions/types.js'
import { type FormDefinition } from '~/src/form/form-definition/types.js'
import { hasFormComponents } from '~/src/pages/helpers.js'

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

/**
 * Returns an array of all hidden fields in a form
 * @param definition - form definition
 */
export function getHiddenFields(definition: FormDefinition) {
  if (definition.pages.length === 0) {
    return []
  }
  const totalHiddenFields = []
  for (const page of definition.pages) {
    const hiddenFields = hasFormComponents(page)
      ? page.components.filter(
          (comp) => comp.type === ComponentType.HiddenField
        )
      : []
    totalHiddenFields.push(...hiddenFields)
  }
  return totalHiddenFields
}
