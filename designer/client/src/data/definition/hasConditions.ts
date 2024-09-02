import { type FormDefinition } from '@defra/forms-model'

export function hasConditions(data: Pick<FormDefinition, 'conditions'>) {
  const { conditions } = data
  return conditions.length > 0
}
