import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { allInputs } from '~/src/data/component/inputs.js'
import { type Input } from '~/src/data/types.js'

test('should return all inputs from the page model', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        section: 'section1',
        components: [
          {
            name: 'name1',
            title: 'Radios',
            type: ComponentType.RadiosField,
            list: 'radios',
            options: {}
          },
          {
            name: 'name2',
            title: 'Radios',
            type: ComponentType.RadiosField,
            list: 'radios',
            options: {}
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
            title: 'Radios',
            type: ComponentType.RadiosField,
            list: 'radios',
            options: {}
          },
          {
            name: 'name4',
            title: 'Radios',
            type: ComponentType.RadiosField,
            list: 'radios',
            options: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(allInputs(data)).toEqual<Input[]>([
    {
      name: 'name1',
      page: {
        path: '/1',
        section: 'section1'
      },
      propertyPath: 'section1.name1',
      title: 'Radios',
      type: ComponentType.RadiosField,
      list: 'radios'
    },
    {
      name: 'name2',
      page: {
        path: '/1',
        section: 'section1'
      },
      propertyPath: 'section1.name2',
      title: 'Radios',
      type: ComponentType.RadiosField,
      list: 'radios'
    },
    {
      name: 'name3',
      page: {
        path: '/2',
        section: 'section1'
      },
      propertyPath: 'section1.name3',
      title: 'Radios',
      type: ComponentType.RadiosField,
      list: 'radios'
    },
    {
      name: 'name4',
      page: {
        path: '/2',
        section: 'section1'
      },
      propertyPath: 'section1.name4',
      title: 'Radios',
      type: ComponentType.RadiosField,
      list: 'radios'
    }
  ])
})

test('should handle no pages', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(allInputs(data)).toEqual([])
})

test('should handle undefined pages', () => {
  const data: FormDefinition = {
    // @ts-expect-error - Allow invalid property for test
    pages: undefined,
    lists: [],
    sections: [],
    conditions: []
  }

  expect(allInputs(data)).toEqual([])
})

test('should handle pages with undefined components', () => {
  const data: FormDefinition = {
    // @ts-expect-error - Allow invalid property for test
    pages: [{}],
    lists: [],
    sections: [],
    conditions: []
  }

  expect(allInputs(data)).toEqual([])
})

test('should handle pages with no components', () => {
  const data = {
    pages: [
      {
        title: 'No components',
        path: '/start',
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(allInputs(data)).toEqual([])
})
