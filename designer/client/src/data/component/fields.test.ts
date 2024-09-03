import {
  ComponentType,
  ControllerPath,
  ControllerType,
  type FormDefinition
} from '@defra/forms-model'

import { getFields, type FieldDef } from '~/src/data/component/fields.js'

test('should return all fields from the page model', () => {
  const data = {
    pages: [
      {
        title: 'page1',
        path: '/1',
        section: 'section1',
        next: [],
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
        next: [],
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
    lists: [
      {
        name: 'radios',
        title: 'Radios',
        type: 'string',
        items: [
          { text: 'text a', description: 'desc a', value: 'value a' },
          { text: 'text b', description: 'desc b', value: 'value b' }
        ]
      }
    ],
    sections: [
      {
        name: 'section1',
        title: 'Section 1'
      }
    ],
    conditions: []
  } satisfies FormDefinition

  expect(getFields(data)).toEqual<FieldDef[]>([
    {
      label: `${data.sections[0].title}: Radios`,
      name: 'name1',
      type: ComponentType.RadiosField,
      values: data.lists[0].items
    },
    {
      label: `${data.sections[0].title}: Radios`,
      name: 'name2',
      type: ComponentType.RadiosField,
      values: data.lists[0].items
    },
    {
      label: `${data.sections[0].title}: Radios`,
      name: 'name3',
      type: ComponentType.RadiosField,
      values: data.lists[0].items
    },
    {
      label: `${data.sections[0].title}: Radios`,
      name: 'name4',
      type: ComponentType.RadiosField,
      values: data.lists[0].items
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

  expect(getFields(data)).toEqual([])
})

test('should handle pages with undefined components', () => {
  const data: FormDefinition = {
    // @ts-expect-error - Allow invalid property for test
    pages: [{}],
    lists: [],
    sections: [],
    conditions: []
  }

  expect(getFields(data)).toEqual([])
})

test('should handle pages with no components', () => {
  const data = {
    pages: [
      {
        title: 'No components',
        path: ControllerPath.Start,
        controller: ControllerType.Start,
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(getFields(data)).toEqual([])
})
