import {
  hasConditionField,
  hasConditionGroup,
  type ConditionData,
  type FormDefinition
} from '@defra/forms-model'

import { getFields } from '~/src/data/component/fields.js'

/**
 * Update conditions to keep display text in sync with the component and section titles
 */
export function fixupConditions(data: FormDefinition) {
  const fields = getFields(data)

  // Check if condition field display text is out of date
  const checkCondition = (condition: ConditionData) => {
    const fieldName = condition.field.name
    const field = fields.find((input) => input.name === fieldName)

    return field && condition.field.display !== field.label ? field : undefined
  }

  // Determine if any of the conditions need fixing
  const hasConditionsChanged = data.conditions.some((wrapper) => {
    return wrapper.value.conditions.some((condition) => {
      if (hasConditionField(condition)) {
        return checkCondition(condition)
      } else if (hasConditionGroup(condition)) {
        return condition.conditions
          .filter((condition) => hasConditionField(condition))
          .some(checkCondition)
      }

      return false
    })
  })

  if (!hasConditionsChanged) {
    return data
  }

  // Copy form definition
  const definition = structuredClone(data)
  const { conditions } = definition

  // Fix up condition field display text
  const fixUpCondition = (condition: ConditionData) => {
    const field = checkCondition(condition)

    if (field) {
      condition.field.display = field.label
    }
  }

  conditions.forEach((condition) => {
    condition.value.conditions.forEach((condition) => {
      if (hasConditionField(condition)) {
        fixUpCondition(condition)
      } else if (hasConditionGroup(condition)) {
        condition.conditions
          .filter((condition) => hasConditionField(condition))
          .forEach(fixUpCondition)
      }
    })
  })

  return definition
}
