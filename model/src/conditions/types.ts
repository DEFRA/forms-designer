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

export interface OperatorDefinition {
  expression: (
    component: Pick<ComponentDef, 'type' | 'id'>,
    conditionValue: Condition['value']
  ) => string
}

export type Conditionals = Record<OperatorName, OperatorDefinition>
