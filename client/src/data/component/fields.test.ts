import {
  ComponentType,
  ConditionType,
  ControllerPath,
  ControllerType,
  Engine,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'

import {
  getFields,
  getFieldsTo,
  type FieldDef
} from '~/src/data/component/fields.js'

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

test('should return fields from previous pages in V2', () => {
  const data = {
    engine: Engine.V2,
    name: 'PC_TEST',
    pages: [
      {
        path: '/page-one',
        title: 'Page one',
        components: [
          {
            name: 'pJNjCG',
            title: 'Yes/No field',
            type: ComponentType.YesNoField,
            options: {}
          },

          {
            name: 'efgIos',
            title: 'Text field',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ],
        next: [
          {
            path: '/summary'
          }
        ]
      },
      {
        title: 'Page two',
        path: '/page-two',
        controller: ControllerType.Terminal,
        next: [],
        components: [
          {
            name: 'zldUTF',
            title: 'Html',
            type: ComponentType.Html,
            content: 'Not allowed',
            options: {}
          }
        ]
      },
      {
        path: '/page-three',
        title: 'Page three',
        components: [
          {
            name: 'dsfTYh',
            title: 'Yes/No field',
            type: ComponentType.YesNoField,
            options: {}
          },

          {
            name: 'RTggjB',
            title: 'Text field',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ],
        next: [
          {
            path: '/summary'
          }
        ]
      },
      {
        title: 'Page four',
        path: '/page-four',
        controller: ControllerType.Terminal,
        next: [],
        components: [
          {
            name: 'cftyJI',
            title: 'Html',
            type: ComponentType.Html,
            content: 'Not allowed',
            options: {}
          }
        ]
      }
    ],
    conditions: [
      {
        name: 'KlQeig',
        displayName: 'isFred',
        value: {
          name: 'isFred',
          conditions: [
            {
              field: {
                name: 'pJNjCG',
                type: ComponentType.YesNoField,
                display: 'Section title: Yes/No field'
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'true',
                display: 'Yes'
              }
            }
          ]
        }
      }
    ],
    sections: [],
    lists: []
  } satisfies FormDefinition

  // Assert that getting the fields to the second
  // page only includes the fields from the first
  const fieldsToPage2 = getFieldsTo(data, data.pages[1].path)
  expect(fieldsToPage2).toHaveLength(2)
  expect(fieldsToPage2.at(0)?.name).toBe(data.pages[0].components[0].name)
  expect(fieldsToPage2.at(1)?.name).toBe(data.pages[0].components[1].name)

  // Assert that getting the fields to the fourth
  // page includes the fields from the first and third
  const fieldsToPage4 = getFieldsTo(data, data.pages[3].path)
  expect(fieldsToPage4).toHaveLength(4)
  expect(fieldsToPage4.at(0)?.name).toBe(data.pages[0].components[0].name)
  expect(fieldsToPage4.at(1)?.name).toBe(data.pages[0].components[1].name)
  expect(fieldsToPage4.at(2)?.name).toBe(data.pages[2].components[0].name)
  expect(fieldsToPage4.at(3)?.name).toBe(data.pages[2].components[1].name)
})
