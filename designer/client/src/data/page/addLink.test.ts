import { type FormDefinition } from '@defra/forms-model'

import { addLink } from '~/src/data/page/addLink.js'

const data = {
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
  conditions: []
} satisfies FormDefinition

test('addLink throws if to, from or both are not found', () => {
  expect(() => addLink(data, '404', '4004')).toThrow(/no page found/)
  expect(() => addLink(data, '404', '/scrambled')).toThrow(/no page found/)
  expect(() => addLink(data, '/scrambled', '404')).toThrow(/no page found/)
})

test('addLink throws if to and from are equal', () => {
  expect(() => addLink(data, '404', '404')).toThrow(
    /cannot link a page to itself/
  )
})

test('addLink successfully adds a new link', () => {
  expect(addLink(data, '/poached', '/sunny')).toEqual<FormDefinition>({
    pages: [
      {
        title: 'scrambled',
        path: '/scrambled',
        next: [{ path: '/poached' }]
      },
      { title: 'poached', path: '/poached', next: [{ path: '/sunny' }] },
      { title: 'sunny', path: '/sunny' }
    ],
    lists: [],
    sections: [],
    conditions: []
  })
})

test('addLink does nothing happens if the link already exists', () => {
  expect(addLink(data, '/scrambled', '/poached')).toEqual({
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
    conditions: []
  })
})
