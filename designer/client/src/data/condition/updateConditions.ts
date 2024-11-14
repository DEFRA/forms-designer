import {
  hasConditionField,
  hasConditionGroup,
  type ConditionData,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { getFields } from '~/src/data/component/fields.js'

/**
 * Update conditions to keep display text in sync with the component and section titles
 */
export function updateConditions(data: FormDefinition) {
  // Copy form definition
  const definition = structuredClone(data)
  const fields = getFields(definition)
  const { conditions } = definition

  // Fix up condition field display text
  const fixUp = (condition: ConditionData) => {
    const fieldName = condition.field.name
    const field = fields.find((input) => input.name === fieldName)

    if (field) {
      condition.field.display = field.label
    }
  }

  conditions.forEach((condition: ConditionWrapper) => {
    condition.value.conditions.forEach((condition) => {
      if (hasConditionField(condition)) {
        fixUp(condition)
      } else if (hasConditionGroup(condition)) {
        condition.conditions
          .filter((condition) => hasConditionField(condition))
          .forEach(fixUp)
      }
    })
  })

  return definition
}
