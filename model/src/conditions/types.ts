import { Condition } from '~/src/conditions/condition'
import { ConditionRef } from '~/src/conditions/condition-ref'
import { ConditionGroup } from '~/src/conditions/condition-group'

export type ConditionsArray = (Condition | ConditionGroup | ConditionRef)[]

export type DateTimeUnitValues =
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'

export type DateUnits = {
  YEARS: { display: 'year(s)'; value: 'years' }
  MONTHS: { display: 'month(s)'; value: 'months' }
  DAYS: { display: 'day(s)'; value: 'days' }
}

export type TimeUnits = {
  HOURS: { display: 'hour(s)'; value: 'hours' }
  MINUTES: { display: 'minute(s)'; value: 'minutes' }
  SECONDS: { display: 'second(s)'; value: 'seconds' }
}
