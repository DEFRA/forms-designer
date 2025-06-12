import { ConditionType, DateDirections, OperatorName } from '@defra/forms-model'

import {
  insertDateValidationErrors,
  listItemRefValueViewModel,
  relativeDateValueViewModel
} from '~/src/models/forms/editor-v2/condition-value.js'

describe('editor-v2 - condition-value', () => {
  describe('insertDateValidationErrors', () => {
    const formsErrors = /** @type {ErrorDetails} */ ({
      [`items[0].value`]: {
        value: 'example value',
        text: 'Error on this field'
      }
    })

    test('should return empty object if field populated', () => {
      expect(insertDateValidationErrors(formsErrors, 0, 'some value')).toEqual(
        {}
      )
    })

    test('should return empty object if no error object', () => {
      expect(insertDateValidationErrors(undefined, 0, '')).toEqual({})
    })

    test('should return error structure if field value undefined', () => {
      expect(insertDateValidationErrors(formsErrors, 0, '')).toEqual({
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
        value: {
          period: '5',
          unit: 'months',
          direction: DateDirections.FUTURE,
          type: ConditionType.RelativeDate
        }
      })
      const model = relativeDateValueViewModel(0, item, undefined)
      expect(model.period).toBeDefined()
      expect(model.period.value).toBe('5')
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
})

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 * @import { ConditionDataV2, List } from '@defra/forms-model'
 */
