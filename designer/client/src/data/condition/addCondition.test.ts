import { type ConditionRawData, type FormDefinition } from '@defra/forms-model'

import { addCondition } from '~/src/data/condition/addCondition.js'

const data: FormDefinition = {
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
}

test('addCondition adds a condition to the list', () => {
  const condition: ConditionRawData = {
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

test('addCondition throws if a condition with the same name already exists', () => {
  expect(() =>
    addCondition(data, {
      displayName: 'a condition',
      name: 'isCondition',
      value: {
        name: 'name',
        conditions: []
      }
    })
  ).toThrow(/A condition/)
})
