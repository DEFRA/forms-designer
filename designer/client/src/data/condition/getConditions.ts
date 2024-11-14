import {
  hasConditionGroup,
  hasConditionName,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { type FieldDef } from '~/src/data/component/fields'

/**
 * @param data - the form definition data
 * @param fields - an array of current fields
 */
export function getConditions(data: FormDefinition, fields: FieldDef[]) {
  const { conditions } = data

  conditions.forEach((condition: ConditionWrapper) => {
    // Fix up condition field display text
    condition.value.conditions.forEach((condition) => {
      if (!hasConditionGroup(condition) && !hasConditionName(condition)) {
        const fieldName = condition.field.name
        const field = fields.find((input) => input.name === fieldName)

        if (field) {
          condition.field.display = field.label
        }
      }
    })
  })

  return conditions
}
