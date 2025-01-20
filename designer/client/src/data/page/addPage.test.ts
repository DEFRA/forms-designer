import { ControllerType, Engine, type FormDefinition } from '@defra/forms-model'

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

test('addPage adds a start page to position 0 in V2', () => {
  const v2 = {
    engine: Engine.V2,
    ...data
  }

  const result = addPage(v2, {
    title: 'Start',
    path: '/start',
    controller: ControllerType.Start,
    next: [{ path: '/scrambled' }],
    components: []
  })

  expect(result.pages).toHaveLength(4)
  expect(result.pages.at(0)).toEqual({
    title: 'Start',
    path: '/start',
    controller: ControllerType.Start,
    next: [{ path: '/scrambled' }],
    components: []
  })
})

test('addPage adds a non-start pages to the last position V2', () => {
  const v2 = {
    engine: Engine.V2,
    ...data
  }

  const result = addPage(v2, {
    title: 'Last',
    path: '/last',
    next: [],
    components: []
  })

  expect(result.pages).toHaveLength(4)
  expect(result.pages.at(result.pages.length - 1)).toEqual({
    title: 'Last',
    path: '/last',
    next: [],
    components: []
  })
})

test('addPage adds pages to the penultimate position if they is a summary page in V2', () => {
  const result = addPage(
    {
      engine: Engine.V2,
      ...data,
      pages: [
        ...data.pages,
        {
          title: 'Summary',
          path: '/summary',
          controller: ControllerType.Summary
        }
      ]
    },
    {
      title: 'Penultimate',
      path: '/penultimate',
      next: [],
      components: []
    }
  )

  expect(result.pages).toHaveLength(5)
  expect(result.pages.at(result.pages.length - 2)).toEqual({
    title: 'Penultimate',
    path: '/penultimate',
    next: [],
    components: []
  })
})
