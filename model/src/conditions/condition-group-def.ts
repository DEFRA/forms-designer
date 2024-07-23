import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'

export class ConditionGroupDef {
  first: number
  last: number

  constructor(first?: number, last?: number) {
    if (typeof first !== 'number' || typeof last !== 'number') {
      throw Error(`Cannot construct a group from ${first} and ${last}`)
    } else if (first >= last) {
      throw Error(`Last (${last}) must be greater than first (${first})`)
    }

    this.first = first
    this.last = last
  }

  contains(index: number) {
    return this.first <= index && this.last >= index
  }

  startsWith(index: number) {
    return this.first === index
  }

  applyTo(
    conditions: (Condition | ConditionRef | ConditionGroup)[]
  ): (Condition | ConditionRef | ConditionGroup)[] {
    return [...conditions].splice(this.first, this.last - this.first + 1)
  }
}
