import { type FormDefinition } from '@defra/forms-model'
import { expect, test } from '@jest/globals'

import { updateLinksTo } from '~/src/data/index.js'

const data: FormDefinition = {
  pages: [
    {
      title: 'page0',
      path: '/0',
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
    },
    {
      title: 'page3',
      section: 'section1',
      path: '/3',
      components: []
    }
  ],
  lists: [],
  sections: [],
  conditions: [],
  outputs: []
}
test('updateLinksTo should update all links pointing to the specified path to the new path', () => {
  const returned = updateLinksTo(data, '/2', '/7')
  expect(returned).toEqual<FormDefinition>({
    pages: [
      {
        title: 'page0',
        path: '/0',
        next: [{ path: '/7', condition: 'badgers' }],
        components: [
          expect.objectContaining({
            name: 'name1'
          }),
          expect.objectContaining({
            name: 'name2'
          })
        ]
      },
      {
        title: 'page1',
        section: 'section1',
        path: '/1',
        next: [{ path: '/7' }],
        components: [
          expect.objectContaining({
            name: 'name1'
          }),
          expect.objectContaining({
            name: 'name2'
          })
        ]
      },
      {
        title: 'page2',
        section: 'section1',
        path: '/7',
        next: [{ path: '/3' }],
        components: [
          expect.objectContaining({
            name: 'name3'
          }),
          expect.objectContaining({
            name: 'name4'
          })
        ]
      },
      {
        title: 'page3',
        section: 'section1',
        path: '/3',
        components: [],
        next: []
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  })
})
