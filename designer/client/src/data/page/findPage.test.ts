import { type FormDefinition } from '@defra/forms-model'

import { findPage } from '~/src/data/index.js'

const data: FormDefinition = {
  pages: [
    {
      title: 'page1',
      section: 'section1',
      path: '/1',
      next: [{ path: '/2' }],
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
      section: 'section1',
      path: '/2',
      next: [{ path: '/3' }],
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
    }
  ],
  lists: [],
  sections: [],
  conditions: [],
  outputs: []
}
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
