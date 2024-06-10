import { type FormDefinition } from '@defra/forms-model'

import { allPathsLeadingTo } from '~/src/data/page/allPathsLeadingTo.js'

test('allPathsLeadingTo should work with cycle in paths', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }]
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/1' }]
      },
      {
        title: 'page3',
        path: '/3'
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  }
  const paths = allPathsLeadingTo(data, '/2')
  expect(paths).toEqual(['/2', '/1'])
})

test('allPathsLeadingTo should work with single parents', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }]
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/3' }]
      },
      {
        title: 'page3',
        path: '/3'
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  }
  expect(allPathsLeadingTo(data, '/3')).toEqual(['/3', '/2', '/1'])
})

test('allPathsLeadingTo should work with multiple parents', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        next: [{ path: '/2' }, { path: '/3' }]
      },
      {
        title: 'page2',
        path: '/2',
        next: [{ path: '/4' }]
      },
      {
        title: 'page3',
        path: '/3',
        next: [{ path: '/4' }]
      },
      {
        title: 'page4',
        path: '/4'
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  }

  expect(allPathsLeadingTo(data, '/4')).toEqual(['/4', '/2', '/1', '/3'])
  expect(allPathsLeadingTo(data, '/3')).toEqual(['/3', '/1'])
  expect(allPathsLeadingTo(data, '/1')).toEqual(['/1'])
})
