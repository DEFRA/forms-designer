import { type FormDefinition } from '@defra/forms-model'

import { allInputs } from '~/src/data/component/inputs.js'
import { type Input } from '~/src/data/types.js'

test('should return all inputs from the page model', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        section: 'section1',
        components: [
          {
            name: 'name1',
            type: 'RadiosField',
            title: 'Radios',
            list: 'radios',
            options: {},
            schema: {}
          },
          {
            name: 'name2',
            type: 'RadiosField',
            title: 'Radios',
            list: 'radios',
            options: {},
            schema: {}
          }
        ]
      },
      {
        title: 'page2',
        path: '/2',
        section: 'section1',
        components: [
          {
            name: 'name3',
            type: 'RadiosField',
            title: 'Radios',
            list: 'radios',
            options: {},
            schema: {}
          },
          {
            name: 'name4',
            type: 'RadiosField',
            title: 'Radios',
            list: 'radios',
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }

  expect(allInputs(data)).toEqual<Input[]>([
    {
      name: 'name1',
      page: {
        path: '/1',
        section: 'section1'
      },
      propertyPath: 'section1.name1',
      type: 'RadiosField',
      title: 'Radios',
      list: 'radios'
    },
    {
      name: 'name2',
      page: {
        path: '/1',
        section: 'section1'
      },
      propertyPath: 'section1.name2',
      type: 'RadiosField',
      title: 'Radios',
      list: 'radios'
    },
    {
      name: 'name3',
      page: {
        path: '/2',
        section: 'section1'
      },
      propertyPath: 'section1.name3',
      type: 'RadiosField',
      title: 'Radios',
      list: 'radios'
    },
    {
      name: 'name4',
      page: {
        path: '/2',
        section: 'section1'
      },
      propertyPath: 'section1.name4',
      type: 'RadiosField',
      title: 'Radios',
      list: 'radios'
    }
  ])
})

test('should handle no pages', () => {
  const data: FormDefinition = {
    pages: [],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }
  expect(allInputs(data)).toEqual([])
})

test('should handle undefined pages', () => {
  const data: FormDefinition = {
    // @ts-expect-error - Allow invalid property for test
    pages: undefined,
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }
  expect(allInputs(data)).toEqual([])
})

test('should handle pages with undefined components', () => {
  const data: FormDefinition = {
    // @ts-expect-error - Allow invalid property for test
    pages: [{}],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }
  expect(allInputs(data)).toEqual([])
})

test('should handle pages with no components', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'No components',
        path: '/start',
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }
  expect(allInputs(data)).toEqual([])
})
