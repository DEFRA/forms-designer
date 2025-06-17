import { ConditionType, DateDirections, OperatorName } from '@defra/forms-model'

import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import {
  buildValueField,
  createSequentialId,
  insertDateValidationErrors,
  listItemRefValueViewModel,
  relativeDateValueViewModel
} from '~/src/models/forms/editor-v2/condition-value.js'

describe('editor-v2 - condition-value', () => {
  describe('insertDateValidationErrors', () => {
    const formsError = /** @type {ErrorDetailsItem} */ ({
      value: 'example value',
      text: 'Error on this field'
    })

    test('should return empty object if field populated', () => {
      expect(insertDateValidationErrors(formsError, 'some value')).toEqual({})
    })

    test('should return empty object if no error object', () => {
      expect(insertDateValidationErrors(undefined, '')).toEqual({})
    })

    test('should return error structure if field value undefined', () => {
      expect(insertDateValidationErrors(formsError, '')).toEqual({
        errorMessage: {
          text: 'Error on this field'
        }
      })
    })
  })

  describe('relativeDateValueViewModel', () => {
    test('should create view model with empty field values', () => {
      const item = /** @type {ConditionDataV2} */ ({
        id: 'id',
        componentId: 'componentId',
        value: {}
      })
      const model = relativeDateValueViewModel(0, item, undefined)
      expect(model.period).toBeDefined()
      expect(model.period.value).toBeUndefined()
      expect(model.unit).toBeDefined()
      expect(model.unit.value).toBeUndefined()
      expect(model.direction).toBeDefined()
      expect(model.direction.value).toBeUndefined()
    })

    test('should create view model with populated field values', () => {
      const item = /** @type {ConditionDataV2} */ ({
        id: 'id',
        componentId: 'componentId',
        operator: OperatorName.Is,
        type: ConditionType.RelativeDate,
        value: {
          period: 5,
          unit: 'months',
          direction: DateDirections.FUTURE
        }
      })
      const model = relativeDateValueViewModel(0, item, undefined)
      expect(model.period).toBeDefined()
      expect(model.period.value).toBe(5)
      expect(model.unit).toBeDefined()
      expect(model.unit.value).toBe('months')
      expect(model.direction).toBeDefined()
      expect(model.direction.value).toBe('in the future')
    })
  })

  describe('listItemRefValueViewModel', () => {
    test('should create view model with empty field value', () => {
      const list = /** @type {List} */ ({
        id: 'list-id',
        name: 'itemId',
        title: '',
        type: 'string',
        items: [
          { text: 'Option 1', value: 'opt1' },
          { text: 'Option 2', value: 'opt2' }
        ]
      })
      expect(listItemRefValueViewModel(list, undefined)).toEqual({
        itemId: {
          id: 'itemId',
          name: 'itemId',
          items: [
            { text: 'Option 1', value: 'opt1' },
            { text: 'Option 2', value: 'opt2' }
          ],
          value: undefined
        }
      })
    })
  })

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
        id: 'items[2].value.itemId',
        items: [
          {
            text: 'Red',
            value: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7',
            id: 'items[2].value.itemId'
          },
          {
            text: 'Blue',
            value: '689d3f66-88f7-4dc0-b199-841b72393c19',
            id: 'items[2].value.itemId1'
          },
          {
            text: 'Green',
            value: '93d8b63b-4eef-4c3e-84a7-5b7edb7f9171',
            id: 'items[2].value.itemId2'
          }
        ],
        name: 'items[2][value][itemId]',
        value: '689d3f66-88f7-4dc0-b199-841b72393c19'
      })
    })

    test('should return list value field with undefined value', () => {
      const listItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        value: {}
      })
      const selectedComponent =
        testFormDefinitionWithMultipleV2Conditions.pages[1].components[0]
      const valueField = /** @type {{ id: string, value: any }} */ (
        buildValueField(
          ConditionType.ListItemRef,
          2,
          listItem,
          selectedComponent,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      )
      expect(valueField.id).toBeDefined()
      expect(valueField.value).toBeUndefined()
    })

    test('should return string value field', () => {
      const stringItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: ConditionType.StringValue,
        value: 'stringval'
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
        name: 'items[2][value]',
        value: 'stringval',
        classes: 'govuk-input--width-10'
      })
    })

    test('should return string value field with undefined value', () => {
      const stringItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is'
      })
      const valueField = /** @type {{ id: string, value: any }} */ (
        buildValueField(
          ConditionType.StringValue,
          2,
          stringItem,
          undefined,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      )
      expect(valueField.id).toBeDefined()
      expect(valueField.value).toBeUndefined()
    })

    test('should return boolean value field', () => {
      const booleanItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: ConditionType.BooleanValue,
        value: true
      })
      const valueField = buildValueField(
        ConditionType.BooleanValue,
        2,
        booleanItem,
        undefined,
        testFormDefinitionWithMultipleV2Conditions,
        undefined
      )
      expect(valueField).toEqual({
        fieldset: {
          legend: {
            text: 'Select a value'
          }
        },
        id: 'items[2].value',
        name: 'items[2][value]',
        value: 'true',
        classes: 'govuk-radios--small',
        items: [
          { text: 'Yes', value: 'true', id: 'items[2].value' },
          { text: 'No', value: 'false', id: 'items[2].value1' }
        ]
      })
    })

    test('should return boolean value field with undefined value', () => {
      const booleanItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is'
      })
      const valueField = /** @type {{ id: string, value: any }} */ (
        buildValueField(
          ConditionType.BooleanValue,
          2,
          booleanItem,
          undefined,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      )
      expect(valueField.id).toBeDefined()
      expect(valueField.value).toBeUndefined()
    })

    test('should return date value field', () => {
      const dateItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: ConditionType.DateValue,
        value: '2024-02-01'
      })
      const valueField = buildValueField(
        ConditionType.DateValue,
        2,
        dateItem,
        undefined,
        testFormDefinitionWithMultipleV2Conditions,
        undefined
      )
      expect(valueField).toEqual({
        fieldset: {
          legend: {
            text: 'Enter a date'
          }
        },
        id: 'items[2].value',
        name: 'items[2][value]',
        items: [
          {
            classes: 'govuk-input--width-2',
            label: 'Day',
            name: 'itemAbsDates[2][day]',
            value: '01'
          },
          {
            classes: 'govuk-input--width-2',
            label: 'Month',
            name: 'itemAbsDates[2][month]',
            value: '02'
          },
          {
            classes: 'govuk-input--width-4',
            label: 'Year',
            name: 'itemAbsDates[2][year]',
            value: '2024'
          }
        ]
      })
    })

    test('should return date value field with undefined value', () => {
      const dateItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: ConditionType.DateValue
      })
      const valueField = /** @type {{ id: string, value: any }} */ (
        buildValueField(
          ConditionType.DateValue,
          2,
          dateItem,
          undefined,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      )
      expect(valueField.id).toBeDefined()
      expect(valueField.value).toBeUndefined()
    })

    test('should return number value field', () => {
      const numberItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: ConditionType.NumberValue,
        value: 1
      })
      const valueField = buildValueField(
        ConditionType.NumberValue,
        2,
        numberItem,
        undefined,
        testFormDefinitionWithMultipleV2Conditions,
        undefined
      )
      expect(valueField).toEqual({
        label: {
          text: 'Enter a value'
        },
        id: 'items[2].value',
        name: 'items[2][value]',
        value: '1',
        classes: 'govuk-input--width-5',
        attributes: {
          inputmode: 'numeric'
        }
      })
    })

    test('should return number value field with undefined value', () => {
      const numberItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is'
      })
      const valueField = /** @type {{ id: string, value: any }} */ (
        buildValueField(
          ConditionType.NumberValue,
          2,
          numberItem,
          undefined,
          testFormDefinitionWithMultipleV2Conditions,
          undefined
        )
      )
      expect(valueField.id).toBeDefined()
      expect(valueField.value).toBeUndefined()
    })

    test('should return relative date fields', () => {
      const dateItem = /** @type {ConditionDataV2} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        value: {
          period: 5
        }
      })
      const valueField =
        /** @type {{ period: any, unit: any, direction: any }} */ (
          buildValueField(
            ConditionType.RelativeDate,
            2,
            dateItem,
            undefined,
            testFormDefinitionWithMultipleV2Conditions,
            undefined
          )
        )
      expect(valueField.period).toBeDefined()
      expect(valueField.unit).toBeDefined()
      expect(valueField.direction).toBeDefined()
    })

    test('should throw if invalid field type', () => {
      const stringItem = /** @type {unknown} */ ({
        id: '1',
        componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        operator: 'is',
        type: 'invalid'
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

  describe('createSequentialId', () => {
    test('should create id', () => {
      expect(createSequentialId('fieldName', 0, 0)).toBe(
        'items[0].value.fieldName'
      )
      expect(createSequentialId('fieldName', 0, 1)).toBe(
        'items[0].value.fieldName1'
      )
      expect(createSequentialId('fieldName', 0, 2)).toBe(
        'items[0].value.fieldName2'
      )

      expect(createSequentialId('fieldName', 5, 0)).toBe(
        'items[5].value.fieldName'
      )
      expect(createSequentialId('fieldName', 5, 1)).toBe(
        'items[5].value.fieldName1'
      )
      expect(createSequentialId('fieldName', 5, 2)).toBe(
        'items[5].value.fieldName2'
      )

      expect(createSequentialId('', 5, 0)).toBe('items[5].value')
      expect(createSequentialId('', 5, 1)).toBe('items[5].value1')
      expect(createSequentialId('', 5, 2)).toBe('items[5].value2')
    })
  })
})

/**
 * @import { ErrorDetails, ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import { ConditionDataV2, List } from '@defra/forms-model'
 */
