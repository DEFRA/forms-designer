import { type FormDefinition } from '@defra/forms-model'

import { findList } from '~/src/data/list/findList.js'

const data = {
  pages: [],
  lists: [
    {
      name: 'listA',
      title: 'List A',
      type: 'string',
      items: []
    },
    {
      name: 'listB',
      title: 'List B',
      type: 'string',
      items: []
    }
  ],
  sections: [],
  conditions: []
} satisfies FormDefinition

test('findList throws when no list can be found', () => {
  expect(() => findList(data, 'listC')).toThrow(/No list found with the name/)
})

test('findList returns a tuple of the list and the index', () => {
  expect(findList(data, 'listA')).toEqual([
    expect.objectContaining({
      name: 'listA'
    }),
    0
  ])
})
