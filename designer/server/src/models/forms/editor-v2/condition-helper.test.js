import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDeclarationFieldComponent,
  buildNumberFieldComponent,
  buildSelectFieldComponent,
  buildTextFieldComponent,
  buildYesNoFieldComponent
} from '@defra/forms-model/stubs'

import {
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
