import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'
import { isConditionWrapperV2 } from '~/src/conditions/migration.js'
import {
  type ConditionData,
  type ConditionGroupData,
  type ConditionRefData
} from '~/src/conditions/types.js'
import {
  type ConditionWrapper,
  type FormDefinition
} from '~/src/form/form-definition/types.js'

type ConditionType = Condition | ConditionRef | ConditionGroup
type ConditionDataType = ConditionGroupData | ConditionData | ConditionRefData

export function toPresentationString(condition: ConditionType) {
  return `${condition.coordinatorString()}${condition.conditionString()}`
}

export function toPresentationHtml(condition: ConditionType) {
  return `${condition.coordinatorHtml()}${condition.conditionString()}`
}

export function toExpression(condition: ConditionType) {
  return `${condition.coordinatorString()}${condition.conditionExpression()}`
}

export const hasConditionField = (
  condition?: ConditionDataType
): condition is ConditionData => {
  return !!condition && 'field' in condition
}

export const hasConditionGroup = (
  condition?: ConditionDataType
): condition is ConditionGroupData => {
  return !!condition && 'conditions' in condition
}

export const hasConditionName = (
  condition?: ConditionDataType
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

export const getConditionV2 = (
  definition: FormDefinition,
  conditionId: string
) => {
  const condition = definition.conditions
    .filter(isConditionWrapperV2)
    .find((condition) => condition.id === conditionId)

  if (!condition) {
    throw new Error(`Condition '${conditionId}' not found in form`)
  }

  return condition
}
