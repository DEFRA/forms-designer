import {
  ComponentType,
  ConditionType,
  Coordinator,
  OperatorName,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { updateConditions } from '~/src/data/condition/updateConditions.js'

const condition = {
  displayName: 'condition',
  name: 'isEnglandOrWales',
  value: {
    name: 'isEnglandOrWales',
    conditions: [
      {
        field: {
          name: 'EsSAwF',
          type: ComponentType.TextField,
          display: 'Text field A'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'England',
          display: 'England'
        }
      },
      {
        coordinator: Coordinator.OR,
        field: {
          name: 'EsSAwF',
          type: ComponentType.TextField,
          display: 'Text field A'
        },
        operator: OperatorName.Is,
        value: {
          type: ConditionType.Value,
          value: 'Wales',
          display: 'Wales'
        }
      }
    ]
  }
} satisfies ConditionWrapper

const data = {
  pages: [
    {
      title: 'page1',
      path: '/1',
      section: 'section1',
      next: [],
      components: [
        {
          name: 'EsSAwF',
          title: 'Country',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        }
      ]
    }
  ],
  lists: [],
  sections: [
    {
      name: 'section1',
      title: 'Section 1'
    }
  ],
  conditions: [{ ...condition }]
} satisfies FormDefinition

test('getConditions successfully updates a condition display text', () => {
  expect(updateConditions(data)).toEqual<FormDefinition>({
    conditions: [
      {
        displayName: 'condition',
        name: 'isEnglandOrWales',
        value: {
          conditions: [
            {
              field: {
                display: 'Section 1: Country',
                name: 'EsSAwF',
                type: ComponentType.TextField
              },
              operator: OperatorName.Is,
              value: {
                display: 'England',
                type: ConditionType.Value,
                value: 'England'
              }
            },
            {
              coordinator: Coordinator.OR,
              field: {
                display: 'Section 1: Country',
                name: 'EsSAwF',
                type: ComponentType.TextField
              },
              operator: OperatorName.Is,
              value: {
                display: 'Wales',
                type: ConditionType.Value,
                value: 'Wales'
              }
            }
          ],
          name: 'isEnglandOrWales'
        }
      }
    ],
    lists: [],
    pages: [
      {
        components: [
          {
            name: 'EsSAwF',
            options: {},
            schema: {},
            title: 'Country',
            type: ComponentType.TextField
          }
        ],
        next: [],
        path: '/1',
        section: 'section1',
        title: 'page1'
      }
    ],
    sections: [{ name: 'section1', title: 'Section 1' }]
  })
})
