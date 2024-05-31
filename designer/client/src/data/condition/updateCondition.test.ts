import { type FormDefinition } from '@defra/forms-model'
import { expect, test } from '@jest/globals'

import { updateCondition } from '~/src/data/index.js'

const condition = {
  displayName: 'condition',
  name: 'isCatPerson',
  value: {
    name: 'newCondition',
    conditions: []
  }
}

const data: FormDefinition = {
  pages: [],
  lists: [],
  sections: [],
  conditions: [{ ...condition }],
  outputs: []
}

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
    ],
    outputs: []
  })
})
