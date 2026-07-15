import { ComponentType } from '~/src/components/enums.js'
import { hasListField } from '~/src/components/helpers.js'
import {
  type ComponentDef,
  type ListComponentsDef
} from '~/src/components/types.js'
import { getYesNoList } from '~/src/components/yes-no-helper.js'
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

/**
 * Finds the list in the component, if it exists. Handles a Yes/No list which doesn't link to the list in the normal way
 * @param { ComponentDef | undefined } component
 * @param {FormDefinition} definition
 * @returns { List | undefined }
 */
export function getListFromComponent(
  component: ComponentDef | undefined,
  definition: FormDefinition
) {
  if (!component) {
    return undefined
  }

  if (component.type === ComponentType.YesNoField) {
    return getYesNoList()
  }

  const listId = hasListField(component) ? component.list : undefined

  if (listId) {
    return definition.lists.find((list) => list.id === listId)
  }

  return undefined
}
