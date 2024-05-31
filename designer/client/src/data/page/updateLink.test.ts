import { type FormDefinition } from '@defra/forms-model'
import { expect, test } from '@jest/globals'

import { updateLink } from '~/src/data/index.js'

const data: FormDefinition = {
  pages: [
    {
      title: 'page1',
      path: '/1',
      next: [{ path: '/2', condition: 'badgers' }],
      components: [
        {
          type: 'TextField',
          name: 'name1',
          title: 'Name 1',
          options: {},
          schema: {}
        },
        {
          type: 'TextField',
          name: 'name2',
          title: 'Name 2',
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
          type: 'TextField',
          name: 'name3',
          title: 'Name 3',
          options: {},
          schema: {}
        },
        {
          type: 'TextField',
          name: 'name4',
          title: 'Name 4',
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
      name: 'badgers',
      value: 'true'
    },
    {
      displayName: 'Kangaroos',
      name: 'isKangaroo',
      value: 'true'
    }
  ],
  outputs: []
}

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
