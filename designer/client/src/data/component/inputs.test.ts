import { type FormDefinition } from '@defra/forms-model'

import { allInputs } from './inputs'
test('should return all inputs from the page model', () => {
  const data: FormDefinition = {
    pages: [
      {
        path: 'page1',
        section: 'section1',
        components: [
          { name: 'name1', type: 'RadiosField' },
          { name: 'name2', type: 'RadiosField' }
        ]
      },
      {
        path: 'page2',
        section: 'section1',
        components: [
          { name: 'name3', type: 'RadiosField' },
          { name: 'name4', type: 'RadiosField' }
        ]
      }
    ]
  }

  expect(allInputs(data)).toEqual([
    {
      name: 'name1',
      page: { path: 'page1', section: 'section1' },
      propertyPath: 'section1.name1',
      list: undefined,
      title: undefined,
      type: 'RadiosField'
    },
    {
      name: 'name2',
      page: { path: 'page1', section: 'section1' },
      propertyPath: 'section1.name2',
      list: undefined,
      title: undefined,
      type: 'RadiosField'
    },
    {
      name: 'name3',
      page: { path: 'page2', section: 'section1' },
      propertyPath: 'section1.name3',
      list: undefined,
      title: undefined,
      type: 'RadiosField'
    },
    {
      name: 'name4',
      page: { path: 'page2', section: 'section1' },
      propertyPath: 'section1.name4',
      list: undefined,
      title: undefined,
      type: 'RadiosField'
    }
  ])
})

test('should handle no pages', () => {
  const data: FormDefinition = { pages: [] }
  expect(allInputs(data)).toEqual([])
})

test('should handle undefined pages', () => {
  const data: FormDefinition = {}
  expect(allInputs(data)).toEqual([])
})

test('should handle pages with undefined components', () => {
  const data: FormDefinition = {
    pages: [{}]
  }
  expect(allInputs(data)).toEqual([])
})

test('should handle pages with no components', () => {
  const data: FormDefinition = {
    pages: [{ components: [] }]
  }
  expect(allInputs(data)).toEqual([])
})
