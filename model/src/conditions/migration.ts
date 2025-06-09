import {
  type ComponentDef,
  type ConditionalComponentType
} from '~/src/components/types.js'
import { ConditionType, type Coordinator } from '~/src/conditions/enums.js'
import {
  type ConditionData,
  type ConditionDataV2,
  type ConditionListItemRefValueDataV2,
  type ConditionRefData,
  type ConditionRefDataV2,
  type ConditionStringValueDataV2,
  type ConditionValueData,
  type RelativeDateValueData
} from '~/src/conditions/types.js'
import {
  type ConditionWrapper,
  type ConditionWrapperV2,
  type List
} from '~/src/form/form-definition/types.js'

function isConditionListItemRefValueDataV2(
  value:
    | ConditionListItemRefValueDataV2
    | ConditionStringValueDataV2
    | RelativeDateValueData
): value is ConditionListItemRefValueDataV2 {
  return value.type === ConditionType.ListItemRef
}

function isConditionStringValueDataV2(
  value:
    | ConditionListItemRefValueDataV2
    | ConditionStringValueDataV2
    | RelativeDateValueData
): value is ConditionStringValueDataV2 {
  return value.type === ConditionType.StringValue
}

function getListItem(model: RuntimeFormModel, listId: string, itemId: string) {
  const foundList = model.getListById(listId)

  if (!foundList) {
    throw Error('List not found')
  }

  const item = foundList.items.find((item) => item.id === itemId)

  if (!item) {
    throw Error('List item not found')
  }

  return item
}

function createConditionValueDataFromListItemRefV2(
  value: ConditionListItemRefValueDataV2,
  model: RuntimeFormModel
): ConditionValueData {
  const refValue = getListItem(model, value.listId, value.itemId)

  return {
    display: refValue.text,
    type: ConditionType.Value,
    value: refValue.value.toString()
  }
}

function createConditionValueDataFromStringValueDataV2(
  value: ConditionStringValueDataV2
): ConditionValueData {
  return {
    type: ConditionType.Value,
    value: value.value,
    display: value.value
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
): ConditionData {
  const component = model.getComponentById(condition.componentId)

  if (!component) {
    throw Error('Component not found')
  }

  let newValue
  if (isConditionListItemRefValueDataV2(condition.value)) {
    newValue = createConditionValueDataFromListItemRefV2(condition.value, model)
  } else if (isConditionStringValueDataV2(condition.value)) {
    newValue = createConditionValueDataFromStringValueDataV2(condition.value)
  } else {
    newValue = condition.value
  }

  return {
    field: {
      name: component.name,
      type: component.type as ConditionalComponentType /** @todo fix this */,
      display: component.title
    },
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
    throw Error('Component not found')
  }

  return {
    conditionName: refCondition.id,
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
        let newCondition: ConditionData | ConditionRefData

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
