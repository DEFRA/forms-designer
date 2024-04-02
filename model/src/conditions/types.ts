import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import { type Condition } from '~/src/conditions/condition.js'

export type ConditionsArray = (Condition | ConditionGroup | ConditionRef)[]

export type DateTimeUnitValues =
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'

export interface DateUnits {
  YEARS: { display: 'year(s)'; value: 'years' }
  MONTHS: { display: 'month(s)'; value: 'months' }
  DAYS: { display: 'day(s)'; value: 'days' }
}

export interface TimeUnits {
  HOURS: { display: 'hour(s)'; value: 'hours' }
  MINUTES: { display: 'minute(s)'; value: 'minutes' }
  SECONDS: { display: 'second(s)'; value: 'seconds' }
}
