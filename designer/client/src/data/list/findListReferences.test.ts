import {
  ComponentType,
  ConditionType,
  Coordinator,
  OperatorName,
  type FormDefinition,
  type Item,
  type List
} from '@defra/forms-model'

import { findListReferences } from '~/src/data/list/findListReferences.js'

const dog = {
  text: 'Dog',
  value: 'Dog'
} satisfies Item

const cat = {
  text: 'Cat',
  value: 'Cat'
} satisfies Item

const rabbit = {
  text: 'Rabbit',
  value: 'Rabbit'
} satisfies Item

const animals = {
  title: 'Animal',
  name: 'acBpwo',
  type: 'string',
  items: [dog, cat, rabbit]
} satisfies List

const data = {
  name: 'Optional',
  startPage: '/page-one',
  pages: [
    {
      title: 'Page one',
      path: '/page-one',
      next: [],
      components: [
        {
          name: 'aYwMGM',
          title: 'Choose animals',
          type: ComponentType.CheckboxesField,
          hint: '',
          list: 'acBpwo',
          options: {}
        },
        {
          name: 'TkMGlf',
          title: 'Animals list',
          type: ComponentType.List,
          list: 'acBpwo',
          options: {}
        }
      ]
    }
  ],
  conditions: [
    {
      name: 'fhktPn',
      displayName: 'groupCondition',
      value: {
        name: 'groupCondition',
        conditions: [
          {
            conditions: [
              {
                field: {
                  name: 'aYwMGM',
                  type: ComponentType.CheckboxesField,
                  display: 'Choose animals'
                },
                operator: OperatorName.Contains,
                value: {
                  type: ConditionType.Value,
                  value: 'Dog',
                  display: 'Dog'
                }
              },
              {
                coordinator: Coordinator.AND,
                field: {
                  name: 'aYwMGM',
                  type: ComponentType.CheckboxesField,
                  display: 'Choose animals'
                },
                operator: OperatorName.Contains,
                value: {
                  type: ConditionType.Value,
                  value: 'Cat',
                  display: 'Cat'
                }
              }
            ]
          }
        ]
      }
    },
    {
      name: 'UmkBiM',
      displayName: 'hasFourLegs',
      value: {
        name: 'hasFourLegs',
        conditions: [
          {
            field: {
              name: 'aYwMGM',
              type: ComponentType.CheckboxesField,
              display: 'Choose animals'
            },
            operator: OperatorName.Contains,
            value: {
              type: ConditionType.Value,
              value: 'Dog',
              display: 'Dog'
            }
          },
          {
            coordinator: Coordinator.OR,
            field: {
              name: 'aYwMGM',
              type: ComponentType.CheckboxesField,
              display: 'Choose animals'
            },
            operator: OperatorName.Contains,
            value: {
              type: ConditionType.Value,
              value: 'Cat',
              display: 'Cat'
            }
          },
          {
            coordinator: Coordinator.OR,
            field: {
              name: 'aYwMGM',
              type: ComponentType.CheckboxesField,
              display: 'Choose animals'
            },
            operator: OperatorName.Contains,
            value: {
              type: ConditionType.Value,
              value: 'Rabbit',
              display: 'Rabbit'
            }
          }
        ]
      }
    }
  ],
  sections: [],
  lists: [animals]
} satisfies FormDefinition

test('findListReferences to "Animals" returns 2 references', () => {
  const references = findListReferences(data, animals)

  expect(references.components).toHaveLength(2)
})
