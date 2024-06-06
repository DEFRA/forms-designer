import { Coordinator } from '@defra/forms-model'

import { type ConditionData } from '~/src/conditions/SelectConditions.jsx'
import { conditionsByType } from '~/src/conditions/select-condition-helpers.js'

const stringCondition = {
  name: 'likesScrambledEggs',
  displayName: 'Likes scrambled eggs',
  value: 'likeScrambled == true'
}

const objectCondition = {
  name: 'likesFriedEggsCond',
  displayName: 'Likes fried eggs',
  value: {
    name: 'likesFriedEggs',
    conditions: [
      {
        value: {
          name: 'likesFried',
          displayName: 'Do you like fried eggs?',
          field: {
            name: 'likesFried',
            type: 'string',
            display: 'Do you like fried eggs?'
          },
          operator: 'is',
          type: 'Value',
          value: 'true',
          display: 'true'
        }
      }
    ]
  }
}

const nestedCondition = {
  name: 'likesFriedAndScrambledEggs',
  displayName: 'Favourite egg is fried and scrambled',
  value: {
    conditions: [
      {
        conditionName: 'likesScrambledEggs',
        conditionDisplayName: 'likes scrambled eggs'
      },
      {
        coordinator: Coordinator.AND,
        ...objectCondition
      }
    ]
  }
}

test('conditionsByType', () => {
  const conditions: ConditionData[] = [
    stringCondition,
    objectCondition,
    nestedCondition
  ]

  expect(conditionsByType(conditions)).toEqual({
    string: [stringCondition],
    nested: [nestedCondition],
    object: [objectCondition]
  })
})
