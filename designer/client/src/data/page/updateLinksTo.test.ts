import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'

const data = {
  startPage: '/0',
  pages: [
    {
      title: 'page0',
      path: '/0',
      next: [{ path: '/1', condition: 'badgers' }],
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
    },
    {
      title: 'page3',
      section: 'section1',
      path: '/3',
      next: [{ path: '/summary' }],
      components: []
    },
    {
      title: 'summary',
      path: '/summary',
      controller: 'SummaryPageController',
      components: []
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

test('updateLinksTo should update all links pointing to the specified path to the new path', () => {
  const returned = updateLinksTo(data, '/2', '/3')
  expect(returned).toEqual<FormDefinition>({
    startPage: '/0',
    pages: [
      {
        title: 'page0',
        path: '/0',
        next: [{ path: '/1', condition: 'badgers' }],
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
        next: [{ path: '/3' }],
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
        path: '/3',
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
        next: [{ path: '/summary' }]
      },
      {
        title: 'summary',
        path: '/summary',
        controller: 'SummaryPageController',
        components: [],
        next: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  })
})
