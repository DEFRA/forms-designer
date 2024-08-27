import { type ConditionWrapper, type FormDefinition } from '@defra/forms-model'

import { hasNext } from '~/src/data/page/hasNext.js'

/**
 * Remove link condition
 */
export function removeCondition(
  data: FormDefinition,
  condition: ConditionWrapper
) {
  const index = data.conditions.indexOf(condition)

  if (index < 0) {
    throw Error(`Condition not found with name '${condition.name}'`)
  }

  const definition = structuredClone(data)
  const { conditions, pages } = definition

  // Remove condition
  conditions.splice(index, 1)

  // Check for condition on page links
  for (const page of pages) {
    if (!hasNext(page)) {
      continue
    }

    // Remove condition from page links
    for (const next of page.next) {
      if (next.condition !== name) {
        continue
      }

      delete next.condition
    }
  }

  return definition
}
