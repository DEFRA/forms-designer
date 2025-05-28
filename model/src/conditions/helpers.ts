import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'
import {
  type ConditionData,
  type ConditionGroupData,
  type ConditionRefData
} from '~/src/conditions/types.js'
import { type ConditionWrapper } from '~/src/form/form-definition/types.js'

export function toPresentationString(
  condition: Condition | ConditionRef | ConditionGroup
) {
  return `${condition.coordinatorString()}${condition.conditionString()}`
}

export function toPresentationHtml(
  condition: Condition | ConditionRef | ConditionGroup
) {
  return `${condition.coordinatorHtml()}${condition.conditionString()}`
}

export function toExpression(
  condition: Condition | ConditionRef | ConditionGroup
) {
  return `${condition.coordinatorString()}${condition.conditionExpression()}`
}

export const hasConditionField = (
  condition?: ConditionGroupData | ConditionData | ConditionRefData
): condition is ConditionData => {
  return !!condition && 'field' in condition
}

export const hasConditionGroup = (
  condition?: ConditionGroupData | ConditionData | ConditionRefData
): condition is ConditionGroupData => {
  return !!condition && 'conditions' in condition
}

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
