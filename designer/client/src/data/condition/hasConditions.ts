import { type FormDefinition } from '@defra/forms-model'

export function hasConditions(conditions: FormDefinition['conditions']) {
  return conditions.length > 0
}
