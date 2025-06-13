import { ComponentType, ConditionType, OperatorName } from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions
} from '~/src/__stubs__/form-definition.js'
import {
  buildConditionEditor,
  buildConditionsFields,
  getComponentId,
  getConditionType,
  getOperator,
  isRelativeDate
} from '~/src/models/forms/editor-v2/condition.js'

describe('editor-v2 - condition model', () => {
  describe('getComponentId', () => {
    test('should return component id if property exists', () => {
      // @ts-expect-error - partial type only
      expect(getComponentId({ componentId: '123' })).toBe('123')
    })
    test('should return undefined if property doesnt exist', () => {
      // @ts-expect-error - force missing property name
      expect(getComponentId({ id: '123' })).toBeUndefined()
    })
  })

  describe('getOperator', () => {
    test('should return operator if property exists', () => {
      // @ts-expect-error - partial type only
      expect(getOperator({ operator: 'is' })).toBe('is')
    })
    test('should return undefined if property doesnt exist', () => {
      // @ts-expect-error - force missing property name
      expect(getOperator({ id: '123' })).toBeUndefined()
    })
  })

  describe('buildConditionEditor', () => {
    test('should return fields', () => {
      const state = {}
      const res = buildConditionEditor(
        testFormDefinitionWithMultipleV2Conditions,
        undefined,
        state
      )
      expect(res.legendText).toBe('')
      expect(res.displayNameField).toEqual({
        classes: 'govuk-input--width-20',
        hint: {
          text: 'Condition names help you to identify conditions in your form, for example, ‘Not a farmer’. Users will not see condition names.'
        },
        id: 'displayName',
        label: {
          classes: 'govuk-label--m',
          text: 'Condition name'
        },
        name: 'displayName',
        value: undefined
      })
      expect(res.coordinator).toEqual({
        classes: 'govuk-radios--inline',
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--m',
            text: 'How do you want to combine these conditions?'
          }
        },
        id: 'coordinator',
        items: [
          { text: 'All conditions must be met (AND)', value: 'and' },
          { text: 'Any condition can be met (OR)', value: 'or' }
        ],
        name: 'coordinator',
        value: undefined
      })
    })
  })

  describe('isRelativeDate', () => {
    test('should return false if no operator', () => {
      expect(isRelativeDate(undefined)).toBeFalsy()
    })

    test('should return false if operator but not for relative dates', () => {
      expect(isRelativeDate(OperatorName.Is)).toBeFalsy()
    })

    test('should return true if operator is for relative dates', () => {
      expect(isRelativeDate(OperatorName.IsAtLeast)).toBeTruthy()
    })
  })

  describe('getConditionType', () => {
    test('should return ListItemRef if a list field', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.AutocompleteField
      })
      expect(getConditionType(component, undefined)).toBe(
        ConditionType.ListItemRef
      )
    })

    test('should return ListItemRef if YesNo field', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.YesNoField
      })
      expect(getConditionType(component, undefined)).toBe(
        ConditionType.BooleanValue
      )
    })

    test('should return RelativeDate if date parts field and operator denotes relative', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.DatePartsField
      })
      expect(getConditionType(component, OperatorName.IsAtLeast)).toBe(
        ConditionType.RelativeDate
      )
    })

    test('should return StringValue if date field but operator does not denote relative', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.DatePartsField
      })
      expect(getConditionType(component, OperatorName.Is)).toBe(
        ConditionType.StringValue
      )
    })

    test('should return StringValue if missing field', () => {
      expect(getConditionType(undefined, undefined)).toBe(
        ConditionType.StringValue
      )
    })

    test('should return NumberValue if number field', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.NumberField
      })
      expect(getConditionType(component, OperatorName.Is)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsNot)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsAtLeast)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsAtMost)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsLessThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsMoreThan)).toBe(
        ConditionType.NumberValue
      )
    })

    test('should return NumberValue if Text field and operator denotes numeric', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.TextField
      })
      expect(getConditionType(component, OperatorName.IsLongerThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsShorterThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.HasLength)).toBe(
        ConditionType.NumberValue
      )
    })

    test('should return NumberValue if Multiline field and operator denotes numeric', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.MultilineTextField
      })
      expect(getConditionType(component, OperatorName.IsLongerThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsShorterThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.HasLength)).toBe(
        ConditionType.NumberValue
      )
    })

    test('should return NumberValue if Email field and operator denotes numeric', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.EmailAddressField
      })
      expect(getConditionType(component, OperatorName.IsLongerThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsShorterThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.HasLength)).toBe(
        ConditionType.NumberValue
      )
    })

    test('should return NumberValue if Telephone field and operator denotes numeric', () => {
      const component = /** @type {ConditionalComponentsDef} */ ({
        type: ComponentType.TelephoneNumberField
      })
      expect(getConditionType(component, OperatorName.IsLongerThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.IsShorterThan)).toBe(
        ConditionType.NumberValue
      )
      expect(getConditionType(component, OperatorName.HasLength)).toBe(
        ConditionType.NumberValue
      )
    })
  })

  describe('buildConditionsFields', () => {
    test('should lookup component', () => {
      const definition = buildDefinition()
      const componentItems = [
        {
          page: [],
          number: 1,
          components: [{ id: 'comp1', type: ComponentType.RadiosField }],
          group: false
        }
      ]
      const item = {
        componentId: 'comp1'
      }
      const res = buildConditionsFields(
        0,
        // @ts-expect-error - complex type
        componentItems,
        item,
        undefined,
        definition
      )
      expect(res.operator?.items).toHaveLength(3)
      expect(res.operator?.items[1].text).toBe('Is')
      expect(res.operator?.items[2].text).toBe('Is not')
    })

    test('should blank out the operator if operator value not applicable to component', () => {
      const definition = buildDefinition()
      const componentItems = [
        {
          page: [],
          number: 1,
          components: [
            { id: 'comp1', type: ComponentType.RadiosField, value: 'something' }
          ],
          group: false
        }
      ]
      const item = {
        componentId: 'comp1',
        operator: 'invalid'
      }
      const res = buildConditionsFields(
        0,
        // @ts-expect-error - complex type
        componentItems,
        item,
        undefined,
        definition
      )
      expect(res.operator?.value).toBeUndefined()
    })
  })
})

/**
 * @import { ConditionalComponentsDef, ConditionDataV2 } from '@defra/forms-model'
 */
