import {
  ComponentType,
  ConditionType,
  Coordinator,
  OperatorName,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { getFields } from '~/src/data/component/fields.js'
import { getConditions } from '~/src/data/condition/getConditions.js'

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

const fields = getFields(data)

test('getConditions successfully updates a condition display text', () => {
  expect(getConditions(data, fields)).toEqual<ConditionWrapper[]>([
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
  ])
})
