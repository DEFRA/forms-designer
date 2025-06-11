import { ComponentType, ConditionType } from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions
} from '~/src/__stubs__/form-definition.js'
import {
  buildConditionEditor,
  buildConditionsFields,
  buildValueField,
  getComponentId,
  getOperator
} from '~/src/models/forms/editor-v2/condition.js'

describe('editor-v2 - condition model', () => {
  describe('buildValueField', () => {
    test('should return list value field', () => {
      const listItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        value: {
          itemId: '689d3f66-88f7-4dc0-b199-841b72393c19'
        }
      })
      const selectedComponent =
        testFormDefinitionWithMultipleV2Conditions.pages[1].components[0]
      const valueField = buildValueField(
        ConditionType.ListItemRef,
        2,
        listItem,
        selectedComponent,
        testFormDefinitionWithMultipleV2Conditions,
        undefined
      )
      expect(valueField).toEqual({
        classes: 'govuk-radios--small',
        fieldset: {
          legend: {
            text: 'Select a value'
          }
        },
        id: 'items[2].value',
        items: [
          { text: 'Red', value: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7' },
          { text: 'Blue', value: '689d3f66-88f7-4dc0-b199-841b72393c19' },
          { text: 'Green', value: '93d8b63b-4eef-4c3e-84a7-5b7edb7f9171' }
        ],
        name: 'items[2][value][itemId]',
        value: '689d3f66-88f7-4dc0-b199-841b72393c19'
      })
    })

    test('should return string value field', () => {
      const stringItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        value: {
          value: 'stringval'
        }
      })
      const valueField = buildValueField(
        ConditionType.StringValue,
        2,
        stringItem,
        undefined,
        testFormDefinitionWithMultipleV2Conditions,
        undefined
      )
      expect(valueField).toEqual({
        label: {
          text: 'Enter a value'
        },
        id: 'items[2].value',
        name: 'items[2][value][value]',
        value: 'stringval',
        classes: 'govuk-input--width-10'
      })
    })

    test('should throw if invalid field type', () => {
      const stringItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        value: {
          value: 'stringval'
        }
      })
      expect(() =>
        buildValueField(
          // @ts-expect-error - enforce invalid type
          'invalid',
          2,
          stringItem,
          undefined,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      ).toThrow('Invalid condition type invalid')
    })
  })

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
      // @ts-expect-error - complex type
      const res = buildConditionsFields(
        0,
        componentItems,
        item,
        undefined,
        definition
      )
      expect(res.operator?.items).toHaveLength(3)
      expect(res.operator?.items[1].text).toBe('Is')
      expect(res.operator?.items[2].text).toBe('Is not')
    })
  })
})

/**
 * @import { ConditionDataV2 } from '@defra/forms-model'
 */
