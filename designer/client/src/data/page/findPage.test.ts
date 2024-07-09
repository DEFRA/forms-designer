import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'

const data = {
  pages: [
    {
      title: 'page1',
      section: 'section1',
      path: '/1',
      next: [{ path: '/2' }],
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
      section: 'section1',
      path: '/2',
      next: [{ path: '/3' }],
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
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

test('findPage should throw if the page does not exist', () => {
  expect(() => findPage(data, '/404')).toThrow()
})

test('findPage should return the page and index if the page exists', () => {
  expect(findPage(data, '/2')).toEqual([
    {
      title: 'page2',
      section: 'section1',
      path: '/2',
      next: [{ path: '/3' }],
      components: [
        expect.objectContaining({ name: 'name3' }),
        expect.objectContaining({ name: 'name4' })
      ]
    },
    1
  ])
})
