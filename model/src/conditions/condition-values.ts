import { ConditionValueAbstract } from '~/src/conditions/condition-value-abstract.js'
import { ConditionType, DateDirections } from '~/src/conditions/enums.js'
import {
  type ConditionValueData,
  type DateTimeUnitValues,
  type DateUnits,
  type RelativeTimeValueData,
  type TimeUnits
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

export const dateUnits: DateUnits = {
  YEARS: { display: 'year(s)', value: 'years' },
  MONTHS: { display: 'month(s)', value: 'months' },
  DAYS: { display: 'day(s)', value: 'days' }
} as const

export const timeUnits: TimeUnits = {
  HOURS: { display: 'hour(s)', value: 'hours' },
  MINUTES: { display: 'minute(s)', value: 'minutes' },
  SECONDS: { display: 'second(s)', value: 'seconds' }
} as const

export const dateTimeUnits: DateUnits & TimeUnits = {
  ...dateUnits,
  ...timeUnits
} as const

export class RelativeTimeValue extends ConditionValueAbstract {
  type: ConditionType.RelativeTime
  timePeriod
  timeUnit
  direction
  timeOnly

  constructor(
    timePeriod: string,
    timeUnit: DateTimeUnitValues,
    direction: DateDirections,
    timeOnly = false
  ) {
    if (typeof timePeriod !== 'string') {
      throw new Error("RelativeTimeValue param 'timePeriod' must be a string")
    }

    if (
      !Object.values(dateTimeUnits)
        .map((unit) => unit.value)
        .includes(timeUnit)
    ) {
      throw new Error(
        "RelativeTimeValue param 'dateTimeUnits' must only include DateTimeUnitValues keys"
      )
    }

    if (!Object.values(DateDirections).includes(direction)) {
      throw new Error(
        "RelativeTimeValue param 'direction' must be from enum DateDirections"
      )
    }

    super()

    this.type = ConditionType.RelativeTime
    this.timePeriod = timePeriod
    this.timeUnit = timeUnit
    this.direction = direction
    this.timeOnly = timeOnly
  }

  toPresentationString() {
    return `${this.timePeriod} ${this.timeUnit} ${this.direction}`
  }

  toExpression(): string {
    const timePeriod =
      this.direction === DateDirections.PAST
        ? 0 - Number(this.timePeriod)
        : this.timePeriod
    return this.timeOnly
      ? `timeForComparison(${timePeriod}, '${this.timeUnit}')`
      : `dateForComparison(${timePeriod}, '${this.timeUnit}')`
  }

  static from(obj: RelativeTimeValue | RelativeTimeValueData) {
    return new RelativeTimeValue(
      obj.timePeriod,
      obj.timeUnit,
      obj.direction,
      obj.timeOnly
    )
  }

  clone() {
    return RelativeTimeValue.from(this)
  }
}

export function conditionValueFrom(
  obj:
    | ConditionValue
    | ConditionValueData
    | RelativeTimeValue
    | RelativeTimeValueData
) {
  switch (obj.type) {
    case ConditionType.Value:
      return ConditionValue.from(obj)

    case ConditionType.RelativeTime:
      return RelativeTimeValue.from(obj)
  }
}
