import {
  type ConditionData,
  type ConditionGroupData,
  type ConditionRefData,
  type ConditionWrapper
} from '@defra/forms-model'

export const hasConditionName = (
  condition?: ConditionGroupData | ConditionData | ConditionRefData
): condition is ConditionRefData => {
  return !!condition && 'conditionName' in condition
}

export const hasNestedCondition = (condition?: ConditionWrapper) => {
  return !!condition?.value.conditions.some(hasConditionName)
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
