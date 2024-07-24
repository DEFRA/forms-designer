import {
  type ComponentDef,
  type ConditionalComponentType
} from '~/src/components/types.js'
import {
  type ConditionValue,
  type RelativeTimeValue
} from '~/src/conditions/condition-values.js'
import {
  type ConditionType,
  type Coordinator,
  type DateDirections,
  type OperatorName
} from '~/src/conditions/enums.js'

export interface ConditionValueData {
  type: ConditionType.Value
  value: string
  display: string
}

export interface RelativeTimeValueData {
  type: ConditionType.RelativeTime
  timePeriod: string
  timeUnit: DateTimeUnitValues
  direction: DateDirections
  timeOnly: boolean
}

export interface ConditionFieldData {
  name: string
  type: ConditionalComponentType
  display: string
}

export interface ConditionData {
  field: ConditionFieldData
  operator: OperatorName
  value: ConditionValueData | RelativeTimeValueData
  coordinator?: Coordinator
}

export interface ConditionRefData {
  conditionName: string
  conditionDisplayName: string
  coordinator?: Coordinator
}

export interface ConditionGroupData {
  conditions: (ConditionData | ConditionRefData | ConditionGroupData)[]
}

export interface ConditionsModelData extends ConditionGroupData {
  name: string
}

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
    component: Pick<ComponentDef, 'type' | 'name'>,
    conditionValue: ConditionValue | RelativeTimeValue
  ) => string
}

export type Conditionals = Record<OperatorName, OperatorDefinition>
