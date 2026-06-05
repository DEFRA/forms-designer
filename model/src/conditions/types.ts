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

export interface ConditionListItemRefValueDataV2 {
  listId: string
  /**
   * Legacy single list item reference. Retained so conditions saved before
   * multi-select support continue to load, display and evaluate. New
   * conditions are written using `itemIds`.
   */
  itemId?: string
  /**
   * One or more referenced list item ids. Written for all new list-based
   * conditions (radio, checkbox, autocomplete, select).
   */
  itemIds?: string[]
  /**
   * How multiple checkbox selections are combined (AND/OR). Only set for
   * checkbox questions; radio/autocomplete/select combine implicitly.
   */
  itemsCoordinator?: Coordinator
}

export interface RelativeDateValueDataV2 {
  period: number
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

export type ConditionValueDataV2 =
  | ConditionListItemRefValueDataV2
  | RelativeDateValueDataV2
  | string
  | boolean
  | number

export interface ConditionDataV2 {
  id: string
  componentId: string
  operator: OperatorName
  type: ConditionType
  value: ConditionValueDataV2
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
