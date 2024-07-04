import { type FormDefinition } from '@defra/forms-model'

import { hasConditions } from '~/src/data/condition/hasConditions.js'

test('hasCondition returns true when there are conditions', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: [
      {
        name: 'a',
        displayName: 'b',
        value: {
          name: 'c',
          conditions: []
        }
      }
    ]
  } satisfies FormDefinition

  expect(hasConditions(data.conditions)).toBe(true)
})

test("hasCondition returns false when there aren't any conditions", () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(hasConditions(data.conditions)).toBe(false)
})
