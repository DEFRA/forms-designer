import { ConditionAbstract } from '~/src/conditions/condition-abstract.js'
import { type Coordinator } from '~/src/conditions/enums.js'

export class ConditionRef extends ConditionAbstract {
  conditionName: string
  conditionDisplayName: string

  constructor(
    conditionName: string,
    conditionDisplayName: string,
    coordinator: Coordinator | undefined
  ) {
    super(coordinator)

    if (typeof conditionName !== 'string') {
      throw new Error("ConditionRef param 'conditionName' must be a string")
    }

    if (typeof conditionDisplayName !== 'string') {
      throw new Error(
        "ConditionRef param 'conditionDisplayName' must be a string"
      )
    }

    this.conditionName = conditionName
    this.conditionDisplayName = conditionDisplayName
  }

  asFirstCondition() {
    this._asFirstCondition()
    return this
  }

  conditionString() {
    return `'${this.conditionDisplayName}'`
  }

  conditionExpression() {
    return this.conditionName
  }

  clone() {
    return new ConditionRef(
      this.conditionName,
      this.conditionDisplayName,
      this.coordinator
    )
  }
}
