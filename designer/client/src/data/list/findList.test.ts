import { FormDefinition } from '@defra/forms-model'
import { findList } from '~/src/data/index.js'

const data: FormDefinition = {
  conditions: [],
  lists: [
    {
      name: 'listA'
    },
    {
      name: 'listB'
    }
  ],
  pages: [],
  sections: []
}

test('findList throws when no list can be found', () => {
  expect(() => findList(data, 'listC')).toThrow(/No list found with the name/)
})

test('findList returns a tuple of the list and the index', () => {
  expect(findList(data, 'listA')).toEqual([
    {
      name: 'listA'
    },
    0
  ])
})
