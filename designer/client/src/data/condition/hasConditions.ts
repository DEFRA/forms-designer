import { type FormDefinition } from '@defra/forms-model'

export function hasConditions(data: FormDefinition) {
  const { conditions } = data
  return conditions.length > 0
}
