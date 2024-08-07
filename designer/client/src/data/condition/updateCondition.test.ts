import { type ConditionWrapper, type FormDefinition } from '@defra/forms-model'

import { updateCondition } from '~/src/data/condition/updateCondition.js'

const condition = {
  displayName: 'condition',
  name: 'isCatPerson',
  value: {
    name: 'newCondition',
    conditions: []
  }
} satisfies ConditionWrapper

const data = {
  pages: [],
  lists: [],
  sections: [],
  conditions: [{ ...condition }]
} satisfies FormDefinition

test('updateCondition throws if no condition could be found', () => {
  expect(() => updateCondition(data, 'isDogPerson', {})).toThrow()
})

test('updateCondition successfully updates a condition', () => {
  expect(
    updateCondition(data, 'isCatPerson', {
      displayName: 'cats rule',
      value: {
        name: 'valueName',
        conditions: []
      }
    })
  ).toEqual<FormDefinition>({
    pages: [],
    lists: [],
    sections: [],
    conditions: [
      {
        displayName: 'cats rule',
        name: 'isCatPerson',
        value: { name: 'valueName', conditions: [] }
      }
    ]
  })
})
