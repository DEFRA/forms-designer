import { type FormDefinition, type List } from '@defra/forms-model'

/**
 * Find list by name
 */
export function findList(
  { lists }: Pick<FormDefinition, 'lists'>,
  nameSearch?: string
) {
  const list = lists.find(({ name }) => name === nameSearch)

  if (!list) {
    throw Error(`List not found with name '${nameSearch}'`)
  }

  return list
}

/**
 * Find list item by name
 */
export function findListItem(list: List, textSearch?: string) {
  const item = list.items.find(({ text }) => text === textSearch)

  if (!item) {
    throw Error(
      `List item not found with text '${textSearch}' for list '${list.name}'`
    )
  }

  return item
}
