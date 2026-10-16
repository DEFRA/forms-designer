import { type FormDefinition } from '@defra/forms-model'

import { findPathsTo } from '~/src/data/page/findPathsTo.js'

test('findPathsTo should work with cycle in paths', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }],
        components: []
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/1' }],
        components: []
      },
      {
        title: 'page3',
        path: '/3',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  const paths = findPathsTo(data, '/2')
  expect(paths).toEqual(['/1', '/2'])
})

test('findPathsTo should work with single parents', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }],
        components: []
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/3' }],
        components: []
      },
      {
        title: 'page3',
        path: '/3',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(findPathsTo(data, '/3')).toEqual(['/1', '/2', '/3'])
})

test('findPathsTo should work with multiple parents', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }, { path: '/3' }],
        components: []
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/4' }],
        components: []
      },
      {
        title: 'page3',
        path: '/3',
        next: [{ path: '/4' }],
        components: []
      },
      {
        title: 'page4',
        path: '/4',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(findPathsTo(data, '/4')).toEqual(['/3', '/1', '/2', '/4'])
  expect(findPathsTo(data, '/3')).toEqual(['/1', '/3'])
  expect(findPathsTo(data, '/1')).toEqual(['/1'])
})

test('findPathsTo should work with empty path', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(findPathsTo(data)).toEqual([])
  expect(findPathsTo(data, '')).toEqual([])
})
