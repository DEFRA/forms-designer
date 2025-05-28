import {
  type ComponentDef,
  type ConditionalComponentType
} from '~/src/components/types.js'
import { ConditionType, type Coordinator } from '~/src/conditions/enums.js'
import {
  type Condition2Data,
  type Condition2RefData,
  type Condition2RefValueData,
  type Condition2ValueData,
  type ConditionData,
  type ConditionRefData,
  type ConditionValueData,
  type RelativeDateValueData
} from '~/src/conditions/types.js'
import {
  type Condition2Wrapper,
  type ConditionWrapper,
  type List
} from '~/src/form/form-definition/types.js'

function isCondition2RefValueData(
  value: Condition2RefValueData | Condition2ValueData | RelativeDateValueData
): value is Condition2RefValueData {
  return value.type === ConditionType.Ref
}

function isCondition2ValueData(
  value: Condition2RefValueData | Condition2ValueData | RelativeDateValueData
): value is Condition2ValueData {
  return value.type === ConditionType.Value
}

function getListItemValue(
  model: RuntimeFormModel,
  listId: string,
  itemId: string
) {
  const foundList = model.getListById(listId)

  if (!foundList) {
    throw Error('List not found')
  }

  return foundList.items.find((item) => item.id === itemId)?.value
}

function createConditionValueDataFromRef(
  value: Condition2RefValueData,
  model: RuntimeFormModel
): ConditionValueData {
  const refValue = getListItemValue(model, value.listId, value.itemId)

  if (!refValue) {
    throw Error('List item not found')
  }

  return {
    display: 'foobar',
    type: ConditionType.Value,
    value: refValue.toString()
  }
}

function createConditionValueDataFromV2(
  value: Condition2ValueData
): ConditionValueData {
  return {
    type: value.type,
    value: value.value,
    display: 'foobar'
  }
}

function isCondition2Data(
  condition: Condition2Data | Condition2RefData
): condition is Condition2Data {
  return 'componentId' in condition
}

function convertCondition2Data(
  model: RuntimeFormModel,
  condition: Condition2Data,
  coordinator: Coordinator | undefined
): ConditionData {
  const component = model.getComponentById(condition.componentId)

  if (!component) {
    throw Error('Component not found')
  }

  let newValue
  if (isCondition2RefValueData(condition.value)) {
    newValue = createConditionValueDataFromRef(condition.value, model)
  } else if (isCondition2ValueData(condition.value)) {
    newValue = createConditionValueDataFromV2(condition.value)
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

function convertCondition2RefData(
  model: RuntimeFormModel,
  condition: Condition2RefData,
  coordinator: Coordinator | undefined
): ConditionRefData {
  const component = model.getComponentById(condition.conditionId)

  if (!component) {
    throw Error('Component not found')
  }

  return {
    conditionName: component.name,
    conditionDisplayName: component.title,
    coordinator
  }
}

export function convertCondition2Wrapper(
  conditionWrapper: Condition2Wrapper,
  model: RuntimeFormModel
): ConditionWrapper {
  let coordinator

  if (conditionWrapper.conditions.length > 1 && !conditionWrapper.coordinator) {
    throw new Error('Coordinator is required for multiple conditions')
  } else {
    coordinator = conditionWrapper.coordinator
  }

  const newConditionWrapper: ConditionWrapper = {
    name: conditionWrapper.name,
    displayName: conditionWrapper.displayName,
    value: {
      name: 'foo',
      conditions: conditionWrapper.conditions.map((condition) => {
        let newCondition: ConditionData | ConditionRefData

        if (isCondition2Data(condition)) {
          newCondition = convertCondition2Data(model, condition, coordinator)
        } else {
          newCondition = convertCondition2RefData(model, condition, coordinator)
        }

        return newCondition
      })
    }
  }

  return newConditionWrapper
}

interface RuntimeFormModel {
  getListById: (listId: string) => List | undefined
  getComponentById: (componentId: string) => ComponentDef | undefined
}
