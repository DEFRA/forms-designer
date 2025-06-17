import { type ListComponentsDef } from '~/src/components/types.js'
import {
  type FormDefinition,
  type List
} from '~/src/form/form-definition/types.js'

/**
 * Given a SelectionComponent finds the associated list
 * @param {ListComponentsDef} selectionComponent
 * @param {FormDefinition} definition
 * @returns {List}
 */
export function findDefinitionListFromComponent(
  selectionComponent: ListComponentsDef,
  definition: FormDefinition
): List {
  const listId = selectionComponent.list
  const list = definition.lists.find((list) => list.id === listId)

  if (list === undefined) {
    throw new Error('List not found')
  }

  return list
}
