import { ConditionValueAbstract } from '~/src/conditions/condition-value-abstract.js'
import { ConditionType, DateDirections } from '~/src/conditions/enums.js'
import { type DateUnits } from '~/src/conditions/enums.js'
import {
  type ConditionValueData,
  type RelativeDateValueData
} from '~/src/conditions/types.js'

export class ConditionValue extends ConditionValueAbstract {
  type: ConditionType.Value
  value: string
  display: string

  constructor(value: string, display?: string) {
    if (!value || typeof value !== 'string') {
      throw new Error("ConditionValue param 'value' must be a string")
    }

    if (display && typeof display !== 'string') {
      throw new Error("ConditionValue param 'display' must be a string")
    }

    super()

    this.type = ConditionType.Value
    this.value = value
    this.display = display ?? value
  }

  toPresentationString() {
    return this.display
  }

  toExpression() {
    return this.value
  }

  static from(obj: ConditionValue | ConditionValueData) {
    return new ConditionValue(obj.value, obj.display)
  }

  clone() {
    return ConditionValue.from(this)
  }
}

export class RelativeDateValue extends ConditionValueAbstract {
  type: ConditionType.RelativeDate
  period
  unit
  direction

  constructor(period: string, unit: DateUnits, direction: DateDirections) {
    if (typeof period !== 'string') {
      throw new Error("RelativeDateValue param 'period' must be a string")
    }

    if (!Object.values(DateDirections).includes(direction)) {
      throw new Error(
        "RelativeDateValue param 'direction' must be from enum DateDirections"
      )
    }

    super()

    this.type = ConditionType.RelativeDate
    this.period = period
    this.unit = unit
    this.direction = direction
  }

  toPresentationString() {
    return `${this.period} ${this.unit} ${this.direction}`
  }

  toExpression(): string {
    const period =
      this.direction === DateDirections.PAST
        ? 0 - Number(this.period)
        : this.period

    return `dateForComparison(${period}, '${this.unit}')`
  }

  static from(obj: RelativeDateValue | RelativeDateValueData) {
    return new RelativeDateValue(obj.period, obj.unit, obj.direction)
  }

  clone() {
    return RelativeDateValue.from(this)
  }
}

export function conditionValueFrom(
  obj:
    | ConditionValue
    | ConditionValueData
    | RelativeDateValue
    | RelativeDateValueData
) {
  switch (obj.type) {
    case ConditionType.Value:
      return ConditionValue.from(obj)

    case ConditionType.RelativeDate:
      return RelativeDateValue.from(obj)
  }
}
