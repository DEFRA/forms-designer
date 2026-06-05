import JoiBase from 'joi'

import {
  buildDateValuesAndErrors,
  dateRangeValidation,
  gdsDateExtension
} from '~/src/common/helpers/date-field-helper.js'

describe('date-field-helper', () => {
  describe('Joi extension', () => {
    const Joi = JoiBase.extend(gdsDateExtension)

    const schema = Joi.object().keys({
      earliestDate: Joi.gdsDateParts().label('First date'),
      latestDate: Joi.gdsDateParts().label('Second date')
    })

    it('should pass a valid date', () => {
      const { value, error } = schema.validate({
        earliestDate: ['18', '11', '2000'],
        latestDate: ['21', '3', '2022']
      })
      expect(error).toBeUndefined()
      expect(value).toEqual({
        earliestDate: '2000-11-18',
        latestDate: '2022-03-21'
      })
    })

    it('should pass (but omit) an empty date', () => {
      const { value, error } = schema.validate({
        earliestDate: ['', '', ''],
        latestDate: ['21', '3', '2022']
      })
      expect(error).toBeUndefined()
      expect(value).toEqual({
        latestDate: '2022-03-21'
      })
    })

    it('should error for invalid object', () => {
      const { error } = schema.validate({
        earliestDate: ['5', '2000'],
        latestDate: ['21', '3', '2022']
      })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })

    it('should error for missing day', () => {
      const { error } = schema.validate({ earliestDate: ['', '5', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must include a day', [], {})
      )
    })

    it('should error for missing month', () => {
      const { error } = schema.validate({ earliestDate: ['14', '', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must include a month', [], {})
      )
    })

    it('should error for missing year', () => {
      const { error } = schema.validate({ earliestDate: ['14', '5', ''] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must include a year', [], {})
      )
    })

    it('should error for out-of-range day', () => {
      const { error } = schema.validate({ earliestDate: ['32', '5', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })

    it('should error for out-of-range month', () => {
      const { error } = schema.validate({ earliestDate: ['14', '0', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })

    it('should error for impossible date', () => {
      const { error } = schema.validate({ earliestDate: ['29', '02', '2001'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })
  })

  describe('buildDateValuesAndErrors', () => {
    it('should build date parts without errors or values', () => {
      expect(buildDateValuesAndErrors('fieldName', {}, undefined)).toEqual({
        items: [
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-2',
            id: 'fieldName-day',
            label: 'Day',
            name: 'fieldName',
            value: ''
          },
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-2',
            id: 'fieldName-month',
            label: 'Month',
            name: 'fieldName',
            value: ''
          },
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-4',
            id: 'fieldName-year',
            label: 'Year',
            name: 'fieldName',
            value: ''
          }
        ]
      })
    })

    it('should build date parts with errors and with values (day and month)', () => {
      const errors = { fieldName: { text: 'Error message for field' } }
      expect(
        buildDateValuesAndErrors(
          'fieldName',
          { fieldName: ['32', '13', '2012'] },
          errors
        )
      ).toEqual({
        errorMessage: {
          text: 'Error message for field'
        },
        items: [
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-2 govuk-input--error',
            id: 'fieldName-day',
            label: 'Day',
            name: 'fieldName',
            value: '32'
          },
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-2 govuk-input--error',
            id: 'fieldName-month',
            label: 'Month',
            name: 'fieldName',
            value: '13'
          },
          {
            autocomplete: 'off',
            classes: 'govuk-input--width-4 govuk-input--error',
            id: 'fieldName-year',
            label: 'Year',
            name: 'fieldName',
            value: '2012'
          }
        ]
      })
    })
  })

  describe('dateRangeValidation', () => {
    it('should error when early but no later', () => {
      const mockHelper = {
        error: jest.fn().mockImplementationOnce((err) => err)
      }
      const values = { earliestDate: '2000-02-01' }
      expect(
        dateRangeValidation(values, mockHelper, 'earliestDate', 'latestDate')
      ).toBe('date.later.required')
    })

    it('should error when later but no early', () => {
      const mockHelper = {
        error: jest.fn().mockImplementationOnce((err) => err)
      }
      const values = { latestDate: '2000-02-01' }
      expect(
        dateRangeValidation(values, mockHelper, 'earliestDate', 'latestDate')
      ).toBe('date.earlier.required')
    })

    it('should error when later is later than early', () => {
      const mockHelper = {
        error: jest.fn().mockImplementationOnce((err) => err)
      }
      const values = { earliestDate: '2001-02-01', latestDate: '2000-02-01' }
      expect(
        dateRangeValidation(values, mockHelper, 'earliestDate', 'latestDate')
      ).toBe('date.swapped')
    })

    it('should pass when early is before later', () => {
      const mockHelper = {
        error: jest.fn().mockImplementationOnce((err) => err)
      }
      const values = { earliestDate: '2001-02-01', latestDate: '2002-02-01' }
      expect(
        dateRangeValidation(values, mockHelper, 'earliestDate', 'latestDate')
      ).toEqual({
        earliestDate: '2001-02-01',
        latestDate: '2002-02-01'
      })
    })
  })
})
