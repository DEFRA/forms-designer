import {
  type ComponentDef,
  type ConditionalComponentType
} from '~/src/components/types.js'
import { type Condition } from '~/src/conditions/condition.js'
import {
  type ConditionType,
  type Coordinator,
  type DateDirections,
  type DateUnits,
  type OperatorName
} from '~/src/conditions/enums.js'

export interface ConditionValueData {
  type: ConditionType.Value
  value: string
  display: string
}

export interface Condition2ValueData {
  type: ConditionType.Value
  value: string
}

export interface Condition2RefValueData {
  type: ConditionType.Ref
  listItemId: string
}

export interface RelativeDateValueData {
  type: ConditionType.RelativeDate
  period: string
  unit: DateUnits
  direction: DateDirections
}

export interface ConditionFieldData {
  name: string
  type: ConditionalComponentType
  display: string
}

export interface ConditionData {
  field: ConditionFieldData
  operator: OperatorName
  value: ConditionValueData | RelativeDateValueData
  coordinator?: Coordinator
}

export interface Condition2Data {
  componentId: string
  operator: OperatorName
  value: Condition2RefValueData | Condition2ValueData | RelativeDateValueData
}

export interface ConditionRefData {
  conditionName: string
  conditionDisplayName: string
  coordinator?: Coordinator
}

export interface Condition2RefData {
  conditionId: string
}

export interface ConditionGroupData {
  conditions: (ConditionData | ConditionRefData | ConditionGroupData)[]
}

export type Condition2GroupData = (Condition2Data | Condition2RefData)[]

export interface ConditionsModelData extends ConditionGroupData {
  name: string
}

export interface OperatorDefinition {
  expression: (
    component: Pick<ComponentDef, 'type' | 'name'>,
    conditionValue: Condition['value']
  ) => string
}

export type Conditionals = Record<OperatorName, OperatorDefinition>
