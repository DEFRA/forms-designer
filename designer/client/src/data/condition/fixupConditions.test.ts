import {
  ComponentType,
  ConditionType,
  Coordinator,
  OperatorName,
  type ConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { fixupConditions } from '~/src/data/condition/fixupConditions.js'

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

const groupCondition = {
  displayName: 'group condition',
  name: 'isScotlandOrNorthernIreland',
  value: {
    name: 'isScotlandOrNorthernIreland',
    conditions: [
      {
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
              value: 'Scotland',
              display: 'Scotland'
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
              value: 'NorthernIreland',
              display: 'Northern Ireland'
            }
          }
        ]
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
  conditions: [condition, groupCondition]
} satisfies FormDefinition

test('updateConditions successfully updates a condition display text', () => {
  expect(fixupConditions(data)).toEqual<FormDefinition>({
    conditions: [
      {
        displayName: 'condition',
        name: 'isEnglandOrWales',
        value: {
          name: 'isEnglandOrWales',
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
          ]
        }
      },
      {
        displayName: 'group condition',
        name: 'isScotlandOrNorthernIreland',
        value: {
          name: 'isScotlandOrNorthernIreland',
          conditions: [
            {
              conditions: [
                {
                  field: {
                    display: 'Section 1: Country',
                    name: 'EsSAwF',
                    type: ComponentType.TextField
                  },
                  operator: OperatorName.Is,
                  value: {
                    display: 'Scotland',
                    type: ConditionType.Value,
                    value: 'Scotland'
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
                    display: 'Northern Ireland',
                    type: ConditionType.Value,
                    value: 'NorthernIreland'
                  }
                }
              ]
            }
          ]
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

test('updateConditions successfully skips updates of a condition when the field is missing', () => {
  const dataWithMissingComponent = {
    ...data,
    pages: []
  }

  expect(fixupConditions(dataWithMissingComponent)).toEqual<FormDefinition>({
    conditions: [
      {
        displayName: 'condition',
        name: 'isEnglandOrWales',
        value: {
          name: 'isEnglandOrWales',
          conditions: [
            {
              field: {
                display: 'Text field A',
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
                display: 'Text field A',
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
          ]
        }
      },
      {
        displayName: 'group condition',
        name: 'isScotlandOrNorthernIreland',
        value: {
          name: 'isScotlandOrNorthernIreland',
          conditions: [
            {
              conditions: [
                {
                  field: {
                    display: 'Text field A',
                    name: 'EsSAwF',
                    type: ComponentType.TextField
                  },
                  operator: OperatorName.Is,
                  value: {
                    display: 'Scotland',
                    type: ConditionType.Value,
                    value: 'Scotland'
                  }
                },
                {
                  coordinator: Coordinator.OR,
                  field: {
                    display: 'Text field A',
                    name: 'EsSAwF',
                    type: ComponentType.TextField
                  },
                  operator: OperatorName.Is,
                  value: {
                    display: 'Northern Ireland',
                    type: ConditionType.Value,
                    value: 'NorthernIreland'
                  }
                }
              ]
            }
          ]
        }
      }
    ],
    lists: [],
    pages: [],
    sections: [{ name: 'section1', title: 'Section 1' }]
  })
})
