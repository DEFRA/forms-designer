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

export interface ConditionStringValueDataV2 {
  type: ConditionType.StringValue
  value: string
}

export interface ConditionListItemRefValueDataV2 {
  type: ConditionType.ListItemRef
  listId: string
  itemId: string
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

export interface ConditionDataV2 {
  id: string
  componentId: string
  operator: OperatorName
  value:
    | ConditionListItemRefValueDataV2
    | ConditionStringValueDataV2
    | RelativeDateValueData
}

export interface ConditionRefData {
  conditionName: string
  conditionDisplayName: string
  coordinator?: Coordinator
}

export interface ConditionRefDataV2 {
  id: string
  conditionId: string
}

export interface ConditionGroupData {
  conditions: (ConditionData | ConditionRefData | ConditionGroupData)[]
}

export type ConditionGroupDataV2 = (ConditionDataV2 | ConditionRefDataV2)[]

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
