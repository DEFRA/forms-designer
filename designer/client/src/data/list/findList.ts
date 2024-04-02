import { FormDefinition, List } from '@defra/forms-model'
import { Found } from '~/src/data'

export function findList(
  data: FormDefinition,
  name: List['name']
): Found<List> {
  const index = data.lists.findIndex((list) => list.name === name)
  if (index < 0) {
    throw Error(`No list found with the name ${name}`)
  }
  return [data.lists[index], index]
}
