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
      path: '/start',
      controller: 'StartPageController',
      next: [{ path: '/badgers' }],
      components: []
    },
    {
      title: 'badgers',
      path: '/badgers',
      next: [
        {
          path: '/disaster',
          condition: 'isBadger'
        }
      ],
      components: []
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
  const updated = removeCondition(data, data.conditions[0])
  expect(updated).toEqual<FormDefinition>({
    pages: [
      {
        title: 'start',
        path: '/start',
        controller: 'StartPageController',
        next: [{ path: '/badgers' }],
        components: []
      },
      {
        title: 'badgers',
        path: '/badgers',
        next: [
          expect.objectContaining({
            path: '/disaster'
          })
        ],
        components: []
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

test('removeCondition should throw if the condition does not exist', () => {
  const conditionNotFound = {
    ...structuredClone(data.conditions[0]),
    name: '404'
  }

  expect(() => removeCondition(data, conditionNotFound)).toThrow(
    "Condition not found with name '404'"
  )
})
