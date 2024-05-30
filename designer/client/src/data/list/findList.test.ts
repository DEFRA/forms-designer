import { type FormDefinition } from '@defra/forms-model'

import { findList } from '~/src/data/index.js'

const data: FormDefinition = {
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
  conditions: [],
  outputs: []
}

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
