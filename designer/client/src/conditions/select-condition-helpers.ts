import { hasNestedCondition, type ConditionWrapper } from '@defra/forms-model'

export const getFieldNameSubstring = (sectionFieldName: string) => {
  return sectionFieldName.substring(sectionFieldName.indexOf('.'))
}

export function conditionsByType(conditions: ConditionWrapper[]) {
  return conditions.reduce<ConditionByTypeMap>(
    (conditionsByType, currentValue) => {
      if (hasNestedCondition(currentValue)) {
        conditionsByType.nested.push(currentValue)
      } else {
        conditionsByType.object.push(currentValue)
      }
      return conditionsByType
    },
    {
      nested: [],
      object: []
    }
  )
}

interface ConditionByTypeMap {
  nested: ConditionWrapper[]
  object: ConditionWrapper[]
}
