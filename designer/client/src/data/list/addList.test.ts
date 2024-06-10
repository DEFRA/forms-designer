import { type FormDefinition } from '@defra/forms-model'

import { addList } from '~/src/data/list/addList.js'

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
  conditions: []
}

test('findList throws when a list with the same name already exists', () => {
  expect(() =>
    addList(data, {
      name: 'listA',
      title: 'list a',
      type: 'string',
      items: []
    })
  ).toThrow(/A list with the name/)
})

test('addList returns a tuple of the list and the index', () => {
  expect(
    addList(data, {
      name: 'pokedex',
      title: '151',
      type: 'number',
      items: []
    }).lists
  ).toEqual([
    expect.objectContaining({ name: 'listA' }),
    expect.objectContaining({ name: 'listB' }),
    expect.objectContaining({
      name: 'pokedex',
      title: '151',
      type: 'number',
      items: []
    })
  ])
})
