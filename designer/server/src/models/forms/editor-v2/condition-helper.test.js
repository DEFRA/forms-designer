import { ConditionType, Coordinator, OperatorName } from '@defra/forms-model'
import {
  buildDeclarationFieldComponent,
  buildNumberFieldComponent,
  buildSelectFieldComponent,
  buildTextFieldComponent,
  buildYesNoFieldComponent
} from '@defra/forms-model/stubs'

import {
  buildItemsCoordinatorField,
  getConditionType,
  isConditionRequiresNumberValue
} from '~/src/models/forms/editor-v2/condition-helper.js'

describe('condition-helper', () => {
  describe('isConditionRequiresNumberValue', () => {
    test('should return false when no operator', () => {
      const component = buildTextFieldComponent()
      expect(isConditionRequiresNumberValue(component, undefined)).toBe(false)
    })

    test('should return false when no component', () => {
      expect(isConditionRequiresNumberValue(undefined, OperatorName.Is)).toBe(
        false
      )
    })

    test('should return true when operator relates to length', () => {
      expect(
        isConditionRequiresNumberValue(undefined, OperatorName.HasLength)
      ).toBe(true)
      expect(
        isConditionRequiresNumberValue(undefined, OperatorName.IsLongerThan)
      ).toBe(true)
      expect(
        isConditionRequiresNumberValue(undefined, OperatorName.IsShorterThan)
      ).toBe(true)
    })

    test('should return false when not a number component', () => {
      const component = buildTextFieldComponent()
      expect(isConditionRequiresNumberValue(component, OperatorName.Is)).toBe(
        false
      )
    })

    test('should return true when a number component', () => {
      const component = buildNumberFieldComponent()
      expect(isConditionRequiresNumberValue(component, OperatorName.Is)).toBe(
        true
      )
    })
  })

  describe('buildItemsCoordinatorField', () => {
    test('should default to AND when no coordinator is set', () => {
      const field = buildItemsCoordinatorField(
        0,
        /** @type {ConditionDataV2} */ ({
          id: '1',
          value: { listId: 'list1', itemIds: ['a', 'b'] }
        })
      )
      expect(field.name).toBe('items[0][value][itemsCoordinator]')
      expect(field.value).toBe(Coordinator.AND)
      expect(field.items).toEqual([
        { text: 'All must be met (AND)', value: Coordinator.AND },
        { text: 'Any can be met (OR)', value: Coordinator.OR }
      ])
    })

    test('should reflect an existing coordinator selection', () => {
      const field = buildItemsCoordinatorField(
        2,
        /** @type {ConditionDataV2} */ ({
          id: '1',
          value: {
            listId: 'list1',
            itemIds: ['a'],
            itemsCoordinator: Coordinator.OR
          }
        })
      )
      expect(field.value).toBe(Coordinator.OR)
      expect(field.name).toBe('items[2][value][itemsCoordinator]')
    })
  })

  describe('getConditionType', () => {
    test('should return ListItemRef when a list component', () => {
      const component = buildSelectFieldComponent()
      expect(getConditionType(component, undefined)).toBe(
        ConditionType.ListItemRef
      )
    })

    test('should return Boolean when a yes/no component', () => {
      const component = buildYesNoFieldComponent()
      expect(getConditionType(component, undefined)).toBe(
        ConditionType.BooleanValue
      )
    })

    test('should return Boolean when a declaration component', () => {
      const component = buildDeclarationFieldComponent()
      expect(getConditionType(component, undefined)).toBe(
        ConditionType.BooleanValue
      )
    })
  })
})

/**
 * @import { ConditionDataV2 } from '@defra/forms-model'
 */
