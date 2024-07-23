import {
  type ConditionData,
  type ConditionGroupData,
  type ConditionRefData,
  type ConditionWrapper
} from '@defra/forms-model'

export const isObjectCondition = (condition: ConditionWrapper) => {
  return typeof condition.value !== 'string'
}

export const isStringCondition = (condition: ConditionWrapper) => {
  return typeof condition.value === 'string'
}

export const hasConditionName = (
  condition: ConditionGroupData | ConditionData | ConditionRefData
) => {
  return 'conditionName' in condition && !!condition.conditionName
}

export const hasNestedCondition = (condition: ConditionWrapper) => {
  if (typeof condition.value === 'string') {
    return false
  }
  return condition.value.conditions.some(hasConditionName)
}

export const isDuplicateCondition = (
  conditions: ConditionWrapper[],
  conditionName: string
) => {
  return conditions.some((condition) => condition.name === conditionName)
}

export const getFieldNameSubstring = (sectionFieldName: string) => {
  return sectionFieldName.substring(sectionFieldName.indexOf('.'))
}

export function conditionsByType(conditions: ConditionWrapper[]) {
  return conditions.reduce<ConditionByTypeMap>(
    (conditionsByType, currentValue) => {
      if (isStringCondition(currentValue)) {
        conditionsByType.string.push(currentValue)
      } else if (hasNestedCondition(currentValue)) {
        conditionsByType.nested.push(currentValue)
      } else if (isObjectCondition(currentValue)) {
        conditionsByType.object.push(currentValue)
      }
      return conditionsByType
    },
    {
      string: [],
      nested: [],
      object: []
    }
  )
}

interface ConditionByTypeMap {
  string: ConditionWrapper[]
  nested: ConditionWrapper[]
  object: ConditionWrapper[]
}
