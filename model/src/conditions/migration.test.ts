import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  ConditionType,
  Coordinator,
  DateDirections,
  DateUnits,
  OperatorName
} from '~/src/conditions/enums.js'
import {
  convertConditionWrapperFromV2,
  generateConditionAlias,
  type RuntimeFormModel
} from '~/src/conditions/migration.js'
import {
  type ConditionWrapperV2,
  type List
} from '~/src/form/form-definition/types.js'

describe('Migration', () => {
  let model: RuntimeFormModel

  beforeEach(() => {
    model = {
      getListById: jest.fn(),
      getComponentById: jest.fn(),
      getConditionById: jest.fn()
    }
  })

  test('convertConditionWrapperFromV2 throws error when coordinator is missing for multiple conditions', () => {
    const conditionWrapper: ConditionWrapperV2 = {
      id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
      displayName: 'Test Wrapper',
      items: [
        {
          id: 'condition1',
          componentId: 'component1',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'test'
        },
        {
          id: 'condition2',
          componentId: 'component2',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'test2'
        }
      ]
    }

    expect(() =>
      convertConditionWrapperFromV2(conditionWrapper, model)
    ).toThrow('Coordinator is required for multiple conditions')
  })

  test('convertConditionWrapperFromV2 converts a single condition correctly', () => {
    const conditionWrapper: ConditionWrapperV2 = {
      id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
      displayName: 'Test Wrapper',
      items: [
        {
          id: 'condition1',
          componentId: 'component1',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'test'
        }
      ]
    }

    const component: ComponentDef = {
      id: 'component1',
      name: 'testComponent',
      title: 'Test Component',
      type: ComponentType.TextField,
      options: {},
      schema: {}
    }

    model.getComponentById = jest.fn().mockReturnValue(component)

    const result = convertConditionWrapperFromV2(conditionWrapper, model)

    expect(result).toEqual({
      name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
      displayName: 'Test Wrapper',
      value: {
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        conditions: [
          {
            field: {
              name: 'testComponent',
              type: ComponentType.TextField,
              display: 'Test Component'
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'test',
              display: 'test'
            },
            coordinator: undefined
          }
        ]
      }
    })
  })

  test('convertConditionWrapperFromV2 throws error when component is not found', () => {
    const conditionWrapper: ConditionWrapperV2 = {
      id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
      displayName: 'Test Wrapper',
      items: [
        {
          id: 'condition1',
          componentId: 'nonExistentComponent',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'test'
        }
      ]
    }

    model.getComponentById = jest.fn().mockReturnValue(undefined)

    expect(() =>
      convertConditionWrapperFromV2(conditionWrapper, model)
    ).toThrow('Component not found')
  })

  describe('ref tests for lists', () => {
    test('convertConditionWrapperFromV2 converts a list item ref condition correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.ListItemRef,
            value: {
              listId: 'list1',
              itemId: 'item1'
            }
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.RadiosField,
        options: {},
        list: 'list1'
      }

      const list: List = {
        id: 'list1',
        items: [
          {
            id: 'item1',
            text: 'Item 1',
            value: 'item1Value'
          }
        ],
        name: 'Test List',
        title: 'Test List',
        type: 'string'
      }

      model.getComponentById = jest.fn().mockReturnValue(component)
      model.getListById = jest.fn().mockReturnValue(list)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              field: {
                name: 'testComponent',
                type: ComponentType.RadiosField,
                display: 'Test Component'
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'item1Value',
                display: 'Item 1'
              },
              coordinator: undefined
            }
          ]
        }
      })
    })

    test('convertConditionWrapperFromV2 throws error when list is not found', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.ListItemRef,
            value: {
              listId: 'nonExistentList',
              itemId: 'item1'
            }
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.RadiosField,
        options: {},
        list: 'list1'
      }

      model.getComponentById = jest.fn().mockReturnValue(component)
      model.getListById = jest.fn().mockReturnValue(undefined)

      expect(() =>
        convertConditionWrapperFromV2(conditionWrapper, model)
      ).toThrow('List nonExistentList not found')
    })

    test('convertConditionWrapperFromV2 throws error when list item is not found', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.ListItemRef,
            value: {
              listId: 'list1',
              itemId: 'nonExistentItem'
            }
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.RadiosField,
        options: {},
        list: 'list1'
      }

      const list: List = {
        id: 'list1',
        items: [],
        name: 'Test List',
        title: 'Test List',
        type: 'string'
      }

      model.getComponentById = jest.fn().mockReturnValue(component)
      model.getListById = jest.fn().mockReturnValue(list)

      expect(() =>
        convertConditionWrapperFromV2(conditionWrapper, model)
      ).toThrow('List item nonExistentItem not found')
    })
  })

  describe('relative date conditions', () => {
    test('convertConditionWrapperFromV2 converts a relative date condition correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.IsAfter,
            type: ConditionType.RelativeDate,
            value: {
              period: 7,
              unit: DateUnits.DAYS,
              direction: DateDirections.FUTURE
            }
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.DatePartsField,
        options: {}
      }

      model.getComponentById = jest.fn().mockReturnValue(component)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              field: {
                name: 'testComponent',
                type: ComponentType.DatePartsField,
                display: 'Test Component'
              },
              operator: OperatorName.IsAfter,
              value: {
                type: ConditionType.RelativeDate,
                period: '7',
                unit: DateUnits.DAYS,
                direction: DateDirections.FUTURE
              },
              coordinator: undefined
            }
          ]
        }
      })
    })
  })

  describe('boolean conditions', () => {
    test('convertConditionWrapperFromV2 converts a boolean condition correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.BooleanValue,
            value: true
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.YesNoField,
        options: {}
      }

      model.getComponentById = jest.fn().mockReturnValue(component)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              field: {
                name: 'testComponent',
                type: ComponentType.YesNoField,
                display: 'Test Component'
              },
              operator: OperatorName.Is,
              value: {
                display: 'Yes',
                type: ConditionType.Value,
                value: 'true'
              },
              coordinator: undefined
            }
          ]
        }
      })
    })
  })

  describe('number conditions', () => {
    test('convertConditionWrapperFromV2 converts a number condition correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.NumberValue,
            value: 1
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.NumberField,
        options: {},
        schema: {}
      }

      model.getComponentById = jest.fn().mockReturnValue(component)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              field: {
                name: 'testComponent',
                type: ComponentType.NumberField,
                display: 'Test Component'
              },
              operator: OperatorName.Is,
              value: {
                display: '1',
                type: ConditionType.Value,
                value: '1'
              },
              coordinator: undefined
            }
          ]
        }
      })
    })
  })

  describe('date conditions', () => {
    test('convertConditionWrapperFromV2 converts a date condition correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        items: [
          {
            id: 'condition1',
            componentId: 'component1',
            operator: OperatorName.Is,
            type: ConditionType.DateValue,
            value: '2001-01-01'
          }
        ]
      }

      const component: ComponentDef = {
        id: 'component1',
        name: 'testComponent',
        title: 'Test Component',
        type: ComponentType.DatePartsField,
        options: {}
      }

      model.getComponentById = jest.fn().mockReturnValue(component)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              field: {
                name: 'testComponent',
                type: ComponentType.DatePartsField,
                display: 'Test Component'
              },
              operator: OperatorName.Is,
              value: {
                display: '2001-01-01',
                type: ConditionType.Value,
                value: '2001-01-01'
              },
              coordinator: undefined
            }
          ]
        }
      })
    })
  })

  describe('ref tests for conditions', () => {
    test('convertConditionWrapperFromV2 converts a condition ref correctly', () => {
      const conditionWrapper: ConditionWrapperV2 = {
        id: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        coordinator: Coordinator.OR,
        items: [
          {
            id: 'c1ec4d73-d0f7-4d1a-8e33-222e60376e69',
            conditionId: 'condition1'
          },
          {
            id: '7a3820bd-a95f-4f90-88a5-20dad9bb8372',
            conditionId: 'condition2'
          }
        ]
      }

      const condition: ConditionWrapperV2 = {
        id: '1f7473dd-45b1-4f7e-b9bf-ea4595d6f642',
        displayName: 'Test condition',
        coordinator: Coordinator.OR,
        items: []
      }

      model.getComponentById = jest.fn().mockReturnValue(condition)
      model.getConditionById = jest.fn().mockReturnValue(condition)

      const result = convertConditionWrapperFromV2(conditionWrapper, model)

      expect(result).toEqual({
        name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
        displayName: 'Test Wrapper',
        value: {
          name: '1df76f06-3aa0-435e-974d-030b3daa0b9d',
          conditions: [
            {
              conditionName: 'cond_1f7473dd45b14f7eb9bfea4595d6f642',
              conditionDisplayName: 'Test condition',
              coordinator: undefined
            },
            {
              conditionName: 'cond_1f7473dd45b14f7eb9bfea4595d6f642',
              conditionDisplayName: 'Test condition',
              coordinator: Coordinator.OR
            }
          ]
        }
      })
    })
  })

  describe('generateConditionAlias', () => {
    test('creates valid JavaScript identifier from UUID', () => {
      const conditionId = '12345678-1234-1234-1234-123456789abc'
      const alias = generateConditionAlias(conditionId)

      expect(alias).toBe('cond_12345678123412341234123456789abc')
    })
  })
})
