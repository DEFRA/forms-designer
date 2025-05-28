import { conditionFrom } from '~/src/conditions/condition-model.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'
import { type Coordinator } from '~/src/conditions/enums.js'
import { toExpression, toPresentationString } from '~/src/conditions/helpers.js'
import { type ConditionGroupData } from '~/src/conditions/types.js'

export class ConditionGroup {
  conditions: (Condition | ConditionRef | ConditionGroup)[]

  constructor(conditions: (Condition | ConditionRef | ConditionGroup)[] = []) {
    if (!Array.isArray(conditions) || conditions.length < 2) {
      throw Error('Cannot construct a condition group from a single condition')
    }

    this.conditions = conditions
  }

  coordinatorString(): string {
    return this.conditions[0].coordinatorString()
  }

  coordinatorHtml(): string {
    return this.conditions[0].coordinatorHtml()
  }

  conditionString(): string {
    const copy = [...this.conditions]
    copy.splice(0, 1)
    return `(${this.conditions[0].conditionString()} ${copy
      .map((condition) => toPresentationString(condition))
      .join(' ')})`
  }

  conditionExpression(): string {
    const copy = [...this.conditions]
    copy.splice(0, 1)
    return `(${this.conditions[0].conditionExpression()} ${copy
      .map((condition) => toExpression(condition))
      .join(' ')})`
  }

  asFirstCondition() {
    this.conditions[0].asFirstCondition()
    return this
  }

  getCoordinator(): Coordinator | undefined {
    return this.conditions[0].getCoordinator()
  }

  setCoordinator(coordinator?: Coordinator) {
    this.conditions[0].setCoordinator(coordinator)
  }

  isGroup() {
    return true
  }

  getGroupedConditions(): (Condition | ConditionRef | ConditionGroup)[] {
    return this.conditions.map((condition) => condition.clone())
  }

  clone(): ConditionGroup {
    return ConditionGroup.from(this)
  }

  toJSON(): ConditionGroupData {
    const { conditions } = this.clone()

    return structuredClone({
      conditions: conditions.map((condition) => condition.toJSON())
    })
  }

  static from(obj: ConditionGroupData | ConditionGroup): ConditionGroup {
    return new ConditionGroup(
      obj.conditions.map((condition) => {
        return 'clone' in condition
          ? condition.clone()
          : conditionFrom(condition)
      })
    )
  }
}
