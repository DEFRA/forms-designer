import { ConditionValueAbstract } from '~/src/conditions/condition-value-abstract.js'
import { Registration } from '~/src/conditions/condition-value-registration.js'
import {
  type DateTimeUnitValues,
  type DateUnits,
  type TimeUnits
} from '~/src/conditions/types.js'

export class ConditionValue extends ConditionValueAbstract {
  value: string
  display: string

  constructor(value: string, display?: string) {
    super(valueType)

    if (!value || typeof value !== 'string') {
      throw new Error("ConditionValue param 'value' must be a string")
    }

    if (display && typeof display !== 'string') {
      throw new Error("ConditionValue param 'display' must be a string")
    }

    this.value = value
    this.display = display || value
  }

  toPresentationString() {
    return this.display
  }

  toExpression() {
    return this.value
  }

  static from(obj: { value: string; display?: string }) {
    return new ConditionValue(obj.value, obj.display)
  }

  clone() {
    return ConditionValue.from(this)
  }
}

const valueType = Registration.register('Value', (obj) =>
  ConditionValue.from(obj)
)

export enum DateDirections {
  FUTURE = 'in the future',
  PAST = 'in the past'
}

export const dateUnits: DateUnits = {
  YEARS: { display: 'year(s)', value: 'years' },
  MONTHS: { display: 'month(s)', value: 'months' },
  DAYS: { display: 'day(s)', value: 'days' }
}

export const timeUnits: TimeUnits = {
  HOURS: { display: 'hour(s)', value: 'hours' },
  MINUTES: { display: 'minute(s)', value: 'minutes' },
  SECONDS: { display: 'second(s)', value: 'seconds' }
}

export const dateTimeUnits: DateUnits & TimeUnits = Object.assign(
  {},
  dateUnits,
  timeUnits
)

export class RelativeTimeValue extends ConditionValueAbstract {
  timePeriod: string
  timeUnit: DateTimeUnitValues
  direction: DateDirections
  timeOnly: boolean

  constructor(
    timePeriod: string,
    timeUnit: DateTimeUnitValues,
    direction: DateDirections,
    timeOnly = false
  ) {
    super(relativeTimeValueType)

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

  static from(obj) {
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

export const relativeTimeValueType = Registration.register(
  'RelativeTime',
  (obj): RelativeTimeValue => RelativeTimeValue.from(obj)
)

type ConditionValueFrom =
  | Pick<ConditionValue, 'type' | 'value' | 'display'>
  | Pick<
      RelativeTimeValue,
      'type' | 'timePeriod' | 'timeUnit' | 'direction' | 'timeOnly'
    >

export function conditionValueFrom(obj: ConditionValueFrom) {
  return Registration.conditionValueFrom(obj)
}
