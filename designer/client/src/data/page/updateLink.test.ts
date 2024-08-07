import {
  ComponentType,
  ConditionType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'

import { updateLink } from '~/src/data/page/updateLink.js'

const data = {
  pages: [
    {
      title: 'page1',
      path: '/1',
      next: [{ path: '/2', condition: 'isBadger' }],
      components: [
        {
          name: 'name1',
          title: 'Name 1',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        },
        {
          name: 'name2',
          title: 'Name 2',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        }
      ]
    },
    {
      title: 'page2',
      path: '/2',
      components: [
        {
          name: 'name3',
          title: 'Name 3',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        },
        {
          name: 'name4',
          title: 'Name 4',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        }
      ]
    },
    {
      title: 'page3',
      path: '/3'
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

test('updateLink throws if from, to, or there is no existing link', () => {
  expect(() => updateLink(data, '/1', '/3')).toThrow(
    /Could not find page or links to update/
  )
})

test('updateLink should remove a condition from a link to the next page', () => {
  expect(updateLink(data, '/1', '/2').pages[0].next).toEqual([
    expect.objectContaining({ path: '/2' })
  ])
})

test('updateLink should add a condition to a link to the next page', () => {
  expect(updateLink(data, '/1', '/2', 'isKangaroos').pages[0].next).toEqual([
    expect.objectContaining({ path: '/2', condition: 'isKangaroos' })
  ])
})
