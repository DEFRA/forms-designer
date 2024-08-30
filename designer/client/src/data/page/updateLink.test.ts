import {
  ComponentType,
  ConditionType,
  OperatorName,
  type FormDefinition,
  type Page
} from '@defra/forms-model'

import { updateLink } from '~/src/data/page/updateLink.js'

const page1 = {
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
} satisfies Page

const page2 = {
  title: 'page2',
  path: '/2',
  next: [],
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
} satisfies Page

const page3 = {
  title: 'page3',
  path: '/3',
  next: [],
  components: []
} satisfies Page

const data = {
  pages: [page1, page2, page3],
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
  const save = () =>
    updateLink(data, page1, page2, {
      path: '/404'
    })

  expect(save).toThrow("Page not found for path '/404'")
})

test('updateLink should skip link update without changes', () => {
  const link = page1.next[0]

  const definition1 = updateLink(data, page1, page2)
  const definition2 = updateLink(data, page1, page2, link)

  expect(definition1).toEqual(data)
  expect(definition2).toEqual(data)

  expect(definition1).toStrictEqual(data)
  expect(definition2).toStrictEqual(data)
})

test('updateLink should remove a condition from a link to the next page', () => {
  const definition = updateLink(data, page1, page2, {
    path: '/2'
  })

  expect(definition.pages[0]).toMatchObject({
    next: [{ path: '/2' }]
  })
})

test('updateLink should add a condition to a link to the next page', () => {
  const definition = updateLink(data, page1, page2, {
    path: '/2',
    condition: 'isKangaroo'
  })

  expect(definition.pages[0]).toMatchObject({
    next: [
      {
        path: '/2',
        condition: 'isKangaroo'
      }
    ]
  })
})
