import { ComponentType } from '~/src/components/enums.js'
import { isConditionalType } from '~/src/components/helpers.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  ConditionType,
  Coordinator,
  OperatorName
} from '~/src/conditions/enums.js'
import {
  type ConditionData,
  type ConditionDataV2,
  type ConditionGroupData,
  type ConditionListItemRefValueDataV2,
  type ConditionRefData,
  type ConditionRefDataV2,
  type ConditionValueData,
  type RelativeDateValueData,
  type RelativeDateValueDataV2
} from '~/src/conditions/types.js'
import { getConditionListItemIds } from '~/src/form/form-definition/helpers.js'
import {
  type ConditionWrapper,
  type ConditionWrapperV2,
  type List
} from '~/src/form/form-definition/types.js'

/**
 * Generate a valid JavaScript identifier from a condition ID
 * @param conditionId - The condition ID (UUID)
 * @returns A valid JavaScript identifier
 */
export const generateConditionAlias = (conditionId: string): string => {
  return `cond_${conditionId.replaceAll('-', '')}`
}

export function isConditionListItemRefValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.ListItemRef
}

export function isConditionStringValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.StringValue
}

export function isConditionBooleanValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.BooleanValue
}

export function isConditionNumberValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.NumberValue
}

export function isConditionDateValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.DateValue
}

export function isConditionRelativeDateValueDataV2(condition: ConditionDataV2) {
  return condition.type === ConditionType.RelativeDate
}

function getListItem(model: RuntimeFormModel, listId: string, itemId: string) {
  const foundList = model.getListById(listId)

  if (!foundList) {
    throw new Error(`List ${listId} not found`)
  }

  const item = foundList.items.find((item) => item.id === itemId)

  if (!item) {
    throw new Error(`List item ${itemId} not found`)
  }

  return item
}

function createConditionValueDataListFromListItemRefV2(
  condition: ConditionDataV2,
  model: RuntimeFormModel
): ConditionValueData[] {
  const value = condition.value as ConditionListItemRefValueDataV2
  const itemIds = getConditionListItemIds(value)

  return itemIds.map((itemId) => {
    const refValue = getListItem(model, value.listId, itemId)

    return {
      display: refValue.text,
      type: ConditionType.Value,
      value: refValue.value.toString()
    }
  })
}

/**
 * Determine how multiple selected list items are combined within a single
 * V2 condition once expanded into individual V1 conditions.
 * - Checkbox questions use the author-chosen coordinator (default OR).
 * - Single-answer questions (radio/autocomplete/select) combine with OR for a
 *   positive match and AND for a negative ("is not any of these") match.
 */
function getListItemsInnerCoordinator(
  componentType: ComponentDef['type'],
  operator: OperatorName,
  itemsCoordinator: Coordinator | undefined
): Coordinator {
  if (componentType === ComponentType.CheckboxesField) {
    return itemsCoordinator ?? Coordinator.OR
  }

  return operator === OperatorName.IsNot ? Coordinator.AND : Coordinator.OR
}

/**
 * Convert a V2 list item ref condition to V1. A single selected item produces
 * a single condition (unchanged from legacy behaviour); multiple selected
 * items produce a nested condition group so they are correctly parenthesised
 * relative to sibling conditions.
 */
function convertListItemRefConditionV2(
  model: RuntimeFormModel,
  condition: ConditionDataV2,
  component: ComponentDef,
  field: ConditionData['field'],
  coordinator: Coordinator | undefined
): ConditionData | ConditionGroupData {
  const value = condition.value as ConditionListItemRefValueDataV2
  const values = createConditionValueDataListFromListItemRefV2(condition, model)

  if (!values.length) {
    throw new Error('List item ref condition has no selected items')
  }

  if (values.length === 1) {
    return {
      field,
      operator: condition.operator,
      value: values[0],
      coordinator
    }
  }

  const innerCoordinator = getListItemsInnerCoordinator(
    component.type,
    condition.operator,
    value.itemsCoordinator
  )

  return {
    conditions: values.map((itemValue, index) => ({
      field,
      operator: condition.operator,
      value: itemValue,
      coordinator: index === 0 ? coordinator : innerCoordinator
    }))
  }
}

function createConditionValueDataFromStringOrDateValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return {
    type: ConditionType.Value,
    value: condition.value as string,
    display: condition.value as string
  }
}

function createConditionValueDataFromStringValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return createConditionValueDataFromStringOrDateValueDataV2(condition)
}

function createConditionValueDataFromDateValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return createConditionValueDataFromStringOrDateValueDataV2(condition)
}

function createConditionValueDataFromRelativeDateValueDataV2(
  condition: ConditionDataV2
): RelativeDateValueData {
  const value = condition.value as RelativeDateValueDataV2
  return {
    type: ConditionType.RelativeDate,
    period: value.period.toString(),
    unit: value.unit,
    direction: value.direction
  }
}

function createConditionValueDataFromNumberValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return {
    type: ConditionType.Value,
    value: (condition.value as number).toString(),
    display: (condition.value as number).toString()
  }
}

function createConditionValueDataFromBooleanValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return {
    type: ConditionType.Value,
    value: (condition.value as boolean).toString(),
    display: (condition.value as boolean) ? 'Yes' : 'No'
  }
}

function createConditionValueDataFromDeclarationValueDataV2(
  condition: ConditionDataV2
): ConditionValueData {
  return {
    type: ConditionType.Value,
    value: (condition.value as boolean).toString(),
    display: (condition.value as boolean) ? 'Agreed' : 'Not agreed'
  }
}

function isConditionDataV2(
  condition: ConditionDataV2 | ConditionRefDataV2
): condition is ConditionDataV2 {
  return 'componentId' in condition
}

function convertConditionDataV2(
  model: RuntimeFormModel,
  condition: ConditionDataV2,
  coordinator: Coordinator | undefined
): ConditionData | ConditionGroupData {
  const component = model.getComponentById(condition.componentId)

  if (!component) {
    throw new Error('Component not found')
  }

  if (!isConditionalType(component.type)) {
    throw new Error(`Component ${component.name} does not support conditions`)
  }

  const field = {
    name: component.name,
    type: component.type,
    display: component.title
  }

  if (isConditionListItemRefValueDataV2(condition)) {
    return convertListItemRefConditionV2(
      model,
      condition,
      component,
      field,
      coordinator
    )
  }

  let newValue
  if (isConditionStringValueDataV2(condition)) {
    newValue = createConditionValueDataFromStringValueDataV2(condition)
  } else if (isConditionBooleanValueDataV2(condition)) {
    newValue =
      component.type === ComponentType.DeclarationField
        ? createConditionValueDataFromDeclarationValueDataV2(condition)
        : createConditionValueDataFromBooleanValueDataV2(condition)
  } else if (isConditionNumberValueDataV2(condition)) {
    newValue = createConditionValueDataFromNumberValueDataV2(condition)
  } else if (isConditionDateValueDataV2(condition)) {
    newValue = createConditionValueDataFromDateValueDataV2(condition)
  } else if (isConditionRelativeDateValueDataV2(condition)) {
    newValue = createConditionValueDataFromRelativeDateValueDataV2(condition)
  } else {
    throw new Error('Unsupported condition type')
  }

  return {
    field,
    operator: condition.operator,
    value: newValue,
    coordinator
  }
}

function convertConditionRefDataFromV2(
  model: RuntimeFormModel,
  condition: ConditionRefDataV2,
  coordinator: Coordinator | undefined
): ConditionRefData {
  const refCondition = model.getConditionById(condition.conditionId)

  if (!refCondition) {
    throw new Error('Component not found')
  }

  return {
    conditionName: generateConditionAlias(refCondition.id),
    conditionDisplayName: refCondition.displayName,
    coordinator
  }
}

export function isConditionWrapperV2(
  wrapper: ConditionWrapper | ConditionWrapperV2
): wrapper is ConditionWrapperV2 {
  return Array.isArray((wrapper as ConditionWrapperV2).items)
}

export function isConditionWrapper(
  wrapper: ConditionWrapper | ConditionWrapperV2
): wrapper is ConditionWrapper {
  return !isConditionWrapperV2(wrapper)
}

export function convertConditionWrapperFromV2(
  conditionWrapper: ConditionWrapperV2,
  model: RuntimeFormModel
): ConditionWrapper {
  let coordinator

  if (conditionWrapper.items.length > 1 && !conditionWrapper.coordinator) {
    throw new Error('Coordinator is required for multiple conditions')
  } else {
    coordinator = conditionWrapper.coordinator
  }

  const newConditionWrapper: ConditionWrapper = {
    name: conditionWrapper.id,
    displayName: conditionWrapper.displayName,
    value: {
      name: conditionWrapper.id,
      conditions: conditionWrapper.items.map((condition, index) => {
        let newCondition: ConditionData | ConditionRefData | ConditionGroupData

        if (isConditionDataV2(condition)) {
          newCondition = convertConditionDataV2(
            model,
            condition,
            index > 0 ? coordinator : undefined
          )
        } else {
          newCondition = convertConditionRefDataFromV2(
            model,
            condition,
            index > 0 ? coordinator : undefined
          )
        }

        return newCondition
      })
    }
  }

  return newConditionWrapper
}

export interface RuntimeFormModel {
  getListById: (listId: string) => List | undefined
  getComponentById: (componentId: string) => ComponentDef | undefined
  getConditionById: (conditionId: string) => ConditionWrapperV2 | undefined
}
