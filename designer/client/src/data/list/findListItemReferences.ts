import {
  ConditionType,
  hasConditionField,
  hasConditionGroup,
  type FormDefinition,
  type Item,
  type List
} from '@defra/forms-model'

import { isConditionWrapper } from '~/src/data/condition/findCondition.js'
import { findListReferences } from '~/src/data/list/findListReferences.js'

/**
 * Find references to a list item
 */
export function findListItemReferences(
  data: FormDefinition,
  list: List,
  item: Item
) {
  //  Get the components that reference this list
  const { components } = findListReferences(data, list)
  const componentNames = components.map((component) => component.name)
  const references = flattenConditions(data).filter((reference) => {
    const value = reference.condition.value
    const field = reference.condition.field

    return (
      value.type === ConditionType.Value &&
      componentNames.includes(field.name) &&
      value.value === item.value
    )
  })

  return { conditions: references }
}

function flattenConditions(data: FormDefinition) {
  const { conditions: wrappers } = data

  return wrappers.filter(isConditionWrapper).flatMap((wrapper) => {
    const model = wrapper.value
    const conditions = model.conditions
    const conditionFields = conditions
      .filter(hasConditionField)
      .map((condition) => {
        return { wrapper, model, condition }
      })

    const conditionGroupFields = conditions
      .filter(hasConditionGroup)
      .flatMap((condition) => {
        return condition.conditions
          .filter(hasConditionField)
          .map((condition) => ({ wrapper, model, condition }))
      })

    return [...conditionFields, ...conditionGroupFields]
  })
}
