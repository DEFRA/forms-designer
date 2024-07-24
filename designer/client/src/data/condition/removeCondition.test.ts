import {
  ComponentType,
  ConditionType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'

import { removeCondition } from '~/src/data/condition/removeCondition.js'

const data = {
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
          condition: 'isBadger'
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: [
    {
      displayName: 'Badgers',
      name: 'isBadger',
      value: {
        name: 'Badgers',
        conditions: [
          {
            field: {
              name: 'name1',
              display: 'Name 1',
              type: ComponentType.TextField
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'badger',
              display: 'badger'
            }
          }
        ]
      }
    },
    {
      displayName: 'Kangaroos',
      name: 'isKangaroo',
      value: {
        name: 'Kangaroos',
        conditions: [
          {
            field: {
              name: 'name1',
              display: 'Name 1',
              type: ComponentType.TextField
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'kangaroo',
              display: 'kangaroo'
            }
          }
        ]
      }
    }
  ]
} satisfies FormDefinition

test('removeCondition should remove conditions from the conditions key and in page links', () => {
  const updated = removeCondition(data, 'isBadger')
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
        name: 'isKangaroo'
      })
    ]
  })
})

test('removeCondition should do nothing if the condition does not exist', () => {
  expect(removeCondition(data, '404')).toEqual<FormDefinition>(data)
})
