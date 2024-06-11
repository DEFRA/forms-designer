import { type ConditionalComponentsDef } from '~/src/components/types.js'
import { type ConditionGroup } from '~/src/conditions/condition-group.js'
import { type ConditionRef } from '~/src/conditions/condition-ref.js'
import {
  type ConditionValue,
  type RelativeTimeValue
} from '~/src/conditions/condition-values.js'
import { type Condition } from '~/src/conditions/condition.js'
import { type OperatorName } from '~/src/conditions/enums.js'

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

export interface OperatorDefinition {
  units?: DateUnits | TimeUnits
  expression: (
    component: Pick<ConditionalComponentsDef, 'type' | 'name'>,
    conditionValue: ConditionValue | RelativeTimeValue
  ) => string
}

export type Conditionals = Record<OperatorName, OperatorDefinition>
