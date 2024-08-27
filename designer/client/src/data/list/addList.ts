import { type FormDefinition, type List } from '@defra/forms-model'

import { findList } from '~/src/data/list/findList.js'

export function addList(data: FormDefinition, list: List) {
  try {
    // Throw for missing list
    findList(data, list.name)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)

    // Add new list
    definition.lists.push(list)

    return definition
  }

  return data
}
