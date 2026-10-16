import { hasNestedCondition, type ConditionWrapper } from '@defra/forms-model'

export const getFieldNameSubstring = (fieldName: string) => {
  const fieldNameIndex = fieldName.indexOf('.')

  if (fieldNameIndex >= 0) {
    return fieldName.substring(fieldNameIndex + 1)
  }

  return fieldName
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
