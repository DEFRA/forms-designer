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
  expect(() => findList(data, 'listC')).toThrow(
    "List not found with name 'listC'"
  )
})

test('findList returns a list object', () => {
  expect(findList(data, 'listA')).toEqual(
    expect.objectContaining({
      name: 'listA'
    })
  )
})
