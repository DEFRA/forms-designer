import { ConditionAbstract } from '~/src/conditions/condition-abstract.js'
import { ConditionField } from '~/src/conditions/condition-field.js'
import { getExpression } from '~/src/conditions/condition-operators.js'
import { ConditionValueAbstract } from '~/src/conditions/condition-value-abstract.js'
import {
  conditionValueFrom,
  type ConditionValue,
  type RelativeDateValue
} from '~/src/conditions/condition-values.js'
import { type Coordinator, type OperatorName } from '~/src/conditions/enums.js'
import { type ConditionData } from '~/src/conditions/types.js'

export class Condition extends ConditionAbstract {
  field: ConditionField
  operator: OperatorName
  value: ConditionValue | RelativeDateValue

  constructor(
    field?: ConditionField,
    operator?: OperatorName,
    value?: ConditionValue | RelativeDateValue,
    coordinator?: Coordinator
  ) {
    if (!(field instanceof ConditionField)) {
      throw new Error("Condition param 'field' must be ConditionField instance")
    }
    if (typeof operator !== 'string') {
      throw new Error("Condition param 'operator' must be a string")
    }
    if (!(value instanceof ConditionValueAbstract)) {
      throw new Error(
        "Condition param 'field' must be ConditionValueAbstract instance"
      )
    }

    super(coordinator)

    this.field = field
    this.operator = operator
    this.value = value
  }

  asFirstCondition() {
    this._asFirstCondition()
    return this
  }

  conditionString() {
    return `'${this.field.display}' ${
      this.operator
    } '${this.value.toPresentationString()}'`
  }

  conditionExpression() {
    return getExpression(
      this.field.type,
      this.field.name,
      this.operator,
      this.value
    )
  }

  clone() {
    return Condition.from(this)
  }

  toJSON(): ConditionData {
    return structuredClone(this.clone())
  }

  static from(obj: ConditionData | Condition) {
    return new Condition(
      ConditionField.from(obj.field),
      obj.operator,
      conditionValueFrom(obj.value),
      obj.coordinator
    )
  }
}
