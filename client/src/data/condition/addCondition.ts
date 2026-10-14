import { type ConditionWrapper, type FormDefinition } from '@defra/forms-model'

import { findCondition } from '~/src/data/condition/findCondition.js'

export function addCondition(
  data: FormDefinition,
  condition: ConditionWrapper
) {
  try {
    // Throw for missing condition
    findCondition(data, condition.name)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)

    // Add new condition
    definition.conditions.push(condition)

    return definition
  }

  return data
}
