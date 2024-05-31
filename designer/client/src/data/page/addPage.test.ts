import { type FormDefinition } from '@defra/forms-model'
import { expect, test } from '@jest/globals'

import { addPage } from '~/src/data/index.js'

const data: FormDefinition = {
  pages: [
    {
      title: 'scrambled',
      path: '/scrambled',
      next: [{ path: '/poached' }]
    },
    { title: 'poached', path: '/poached' },
    { title: 'sunny', path: '/sunny' }
  ],
  lists: [],
  sections: [],
  conditions: [],
  outputs: []
}

test('addPage throws if a page with the same path already exists', () => {
  expect(() =>
    addPage(data, {
      title: 'scrambled',
      path: '/scrambled'
    })
  ).toThrow(/A page with the path/)
})

test('addPage adds a page if one does not exist with the same path', () => {
  expect(
    addPage(data, {
      title: 'soft boiled',
      path: '/soft-boiled'
    }).pages
  ).toContainEqual({
    title: 'soft boiled',
    path: '/soft-boiled'
  })
})
