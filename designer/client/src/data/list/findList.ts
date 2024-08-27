import { type FormDefinition } from '@defra/forms-model'

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
