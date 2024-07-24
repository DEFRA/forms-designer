import {
  ComponentType,
  ConditionType,
  Coordinator,
  OperatorName,
  type ConditionWrapper
} from '@defra/forms-model'

import { conditionsByType } from '~/src/conditions/select-condition-helpers.js'

const condition1 = {
  name: 'friedEggsYes',
  displayName: 'Does like fried eggs',
  value: {
    name: 'Does like fried eggs',
    conditions: [
      {
        field: {
          name: 'friedEggs',
          type: ComponentType.YesNoField,
          display: 'Do you like fried eggs?'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'yes',
          display: 'Yes, I do like fried eggs'
        }
      }
    ]
  }
} satisfies ConditionWrapper

const condition2 = {
  name: 'friedEggsNo',
  displayName: 'Does not like fried eggs',
  value: {
    name: 'Does not like fried eggs',
    conditions: [
      {
        field: {
          name: 'friedEggs',
          type: ComponentType.YesNoField,
          display: 'Do you like fried eggs?'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'no',
          display: 'No, I do not like fried eggs'
        }
      }
    ]
  }
} satisfies ConditionWrapper

const condition3 = {
  name: 'vegetarian',
  displayName: 'Dietary requirement: vegetarian',
  value: {
    name: 'Dietary requirement: vegetarian',
    conditions: [
      {
        field: {
          name: 'dietaryRequirement',
          type: ComponentType.RadiosField,
          display: 'Do you have any dietary requirements?'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'vegetarian',
          display: 'Vegetarian'
        }
      }
    ]
  }
} satisfies ConditionWrapper

const condition4 = {
  name: 'vegan',
  displayName: 'Dietary requirement: vegan',
  value: {
    name: 'Dietary requirement: vegan',
    conditions: [
      {
        field: {
          name: 'dietaryRequirement',
          type: ComponentType.RadiosField,
          display: 'Do you have any dietary requirements?'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'vegan',
          display: 'Vegan'
        }
      }
    ]
  }
} satisfies ConditionWrapper

const nestedCondition1 = {
  name: 'friedEggsYesVegetarian',
  displayName: 'Fried eggs (vegetarian)',
  value: {
    name: 'Fried eggs (vegetarian)',
    conditions: [
      {
        conditionName: 'friedEggsYes',
        conditionDisplayName: 'Does like fried eggs'
      },
      {
        coordinator: Coordinator.AND,
        conditionName: 'vegetarian',
        conditionDisplayName: 'Dietary requirement: vegetarian'
      }
    ]
  }
} satisfies ConditionWrapper

const nestedCondition2 = {
  name: 'friedEggsYesNotVegan',
  displayName: 'Fried eggs (not vegan)',
  value: {
    name: 'Fried eggs (not vegan)',
    conditions: [
      {
        conditionName: 'friedEggsYes',
        conditionDisplayName: 'Does like fried eggs'
      },
      {
        coordinator: Coordinator.AND,
        field: condition3.value.conditions[0].field,
        operator: condition3.value.conditions[0].operator,
        value: condition3.value.conditions[0].value
      }
    ]
  }
} satisfies ConditionWrapper

test('conditionsByType', () => {
  const conditions: ConditionWrapper[] = [
    condition1,
    condition2,
    condition3,
    condition4,
    nestedCondition1,
    nestedCondition2
  ]

  expect(conditionsByType(conditions)).toEqual({
    nested: [nestedCondition1, nestedCondition2],
    object: [condition1, condition2, condition3, condition4]
  })
})
