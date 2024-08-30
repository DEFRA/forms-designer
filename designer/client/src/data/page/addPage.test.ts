import { type FormDefinition } from '@defra/forms-model'

import { addPage } from '~/src/data/page/addPage.js'

const data = {
  pages: [
    {
      title: 'scrambled',
      path: '/scrambled',
      next: [{ path: '/poached' }],
      components: []
    },
    {
      title: 'poached',
      path: '/poached',
      next: [],
      components: []
    },
    {
      title: 'sunny',
      path: '/sunny',
      next: [],
      components: []
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

test('addPage does nothing if a page with the same path already exists', () => {
  expect(() =>
    addPage(data, {
      title: 'scrambled',
      path: '/scrambled',
      next: [],
      components: []
    })
  ).not.toThrow()
})

test('addPage adds a page if one does not exist with the same path', () => {
  expect(
    addPage(data, {
      title: 'soft boiled',
      path: '/soft-boiled',
      next: [],
      components: []
    }).pages
  ).toContainEqual({
    title: 'soft boiled',
    path: '/soft-boiled',
    next: [],
    components: []
  })
})
