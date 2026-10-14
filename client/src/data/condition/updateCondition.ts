import { type ConditionWrapper, type FormDefinition } from '@defra/forms-model'

import { findCondition } from '~/src/data/condition/findCondition.js'
import { hasConditions } from '~/src/data/definition/hasConditions.js'

/**
 * @param data
 * @param conditionName
 * @param conditionUpdate - The condition name cannot be changed, hence Omit<ConditionWrapper, "name">
 */
export function updateCondition(
  data: FormDefinition,
  conditionName: string,
  conditionUpdate: Partial<Omit<ConditionWrapper, 'name'>>
) {
  if (!hasConditions(data)) {
    throw Error('Conditions not found to update')
  }

  const condition = findCondition(data, conditionName)
  const index = data.conditions.indexOf(condition)

  // Copy condition, update properties
  const conditionCopy = structuredClone(condition)
  Object.assign(conditionCopy, conditionUpdate)

  // Copy form definition
  const definition = structuredClone(data)

  // Replace condition
  definition.conditions[index] = conditionCopy

  return definition
}
