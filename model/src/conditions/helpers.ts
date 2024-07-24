import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'

export function toPresentationString(
  condition: Condition | ConditionRef | ConditionGroup
) {
  return `${condition.coordinatorString()}${condition.conditionString()}`
}

export function toExpression(
  condition: Condition | ConditionRef | ConditionGroup
) {
  return `${condition.coordinatorString()}${condition.conditionExpression()}`
}
