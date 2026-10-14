import { type ConditionWrapper, type FormDefinition } from '@defra/forms-model'

import { addCondition } from '~/src/data/condition/addCondition.js'

const data = {
  pages: [],
  lists: [],
  sections: [],
  conditions: [
    {
      displayName: 'a condition',
      name: 'isCondition',
      value: { name: 'name', conditions: [] }
    }
  ]
} satisfies FormDefinition

test('addCondition adds a condition to the list', () => {
  const condition: ConditionWrapper = {
    displayName: 'added condition',
    name: 'new',
    value: {
      name: 'newCondition',
      conditions: []
    }
  }

  expect(addCondition(data, condition)).toEqual<FormDefinition>({
    pages: [],
    lists: [],
    sections: [],
    conditions: [...data.conditions, condition]
  })
})

test('addCondition does nothing if a condition with the same name already exists', () => {
  const condition: ConditionWrapper = {
    displayName: 'a condition',
    name: 'isCondition',
    value: {
      name: 'name',
      conditions: []
    }
  }

  expect(() => addCondition(data, condition)).not.toThrow()
})
