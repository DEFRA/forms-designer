import { type FormDefinition } from '@defra/forms-model'

import { removeCondition } from '~/src/data/index.js'

const data: FormDefinition = {
  pages: [
    {
      title: 'start',
      next: [],
      path: '/'
    },
    {
      title: 'badgers',
      path: '/badgers',
      next: [
        {
          path: '/summary'
        },
        {
          path: '/disaster',
          condition: 'someName'
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: [
    {
      displayName: 'Some name',
      name: 'someName',
      value: 'true'
    },
    {
      displayName: 'Another name',
      name: 'anotherName',
      value: 'true'
    }
  ],
  outputs: []
}

test('removeCondition should remove conditions from the conditions key and in page links', () => {
  const updated = removeCondition(data, 'someName')
  expect(updated).toEqual<FormDefinition>({
    pages: [
      {
        title: 'start',
        next: [],
        path: '/'
      },
      {
        title: 'badgers',
        path: '/badgers',
        next: [
          expect.objectContaining({
            path: '/summary'
          }),
          expect.objectContaining({
            path: '/disaster'
          })
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: [
      expect.objectContaining({
        name: 'anotherName'
      })
    ],
    outputs: []
  })
})

test('removeCondition should do nothing if the condition does not exist', () => {
  expect(removeCondition(data, '404')).toEqual<FormDefinition>(data)
})
