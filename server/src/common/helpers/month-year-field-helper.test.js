import JoiBase from 'joi'

import {
  buildMonthYearValuesAndErrors,
  gdsMonthYearExtension
} from '~/src/common/helpers/month-year-field-helper.js'

describe('month-year-field-helper', () => {
  describe('Joi extension', () => {
    const Joi = JoiBase.extend(gdsMonthYearExtension)

    const schema = Joi.object().keys({
      earliestMonthYear: Joi.gdsMonthYearParts().label('First date'),
      latestMonthYear: Joi.gdsMonthYearParts().label('Second date')
    })

    it('should pass a valid date', () => {
      const { value, error } = schema.validate({
        earliestMonthYear: ['11', '2000'],
        latestMonthYear: ['3', '2022']
      })
      expect(error).toBeUndefined()
      expect(value).toEqual({
        earliestMonthYear: new Date('2000-11-01'),
        latestMonthYear: new Date('2022-03-01')
      })
    })

    it('should pass (but omit) an empty date', () => {
      const { value, error } = schema.validate({
        earliestMonthYear: ['', ''],
        latestMonthYear: ['3', '2022']
      })
      expect(error).toBeUndefined()
      expect(value).toEqual({
        earliestMonthYear: undefined,
        latestMonthYear: new Date('2022-03-01')
      })
    })

    it('should error for invalid object', () => {
      const { error } = schema.validate({
        earliestMonthYear: ['2000'],
        latestMonthYear: ['3', '2022']
      })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })

    it('should error for missing month', () => {
      const { error } = schema.validate({ earliestMonthYear: ['', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must include a month', [], {})
      )
    })

    it('should error for missing year', () => {
      const { error } = schema.validate({ earliestMonthYear: ['11', ''] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must include a year', [], {})
      )
    })

    it('should error for out-of-range month', () => {
      const { error } = schema.validate({ earliestMonthYear: ['14', '2000'] })
      expect(error).toEqual(
        new JoiBase.ValidationError('"First date" must be a real date', [], {})
      )
    })
  })

  describe('buildMonthYearValuesAndErrors', () => {
    it('should build date parts without errors or values', () => {
      expect(buildMonthYearValuesAndErrors('fieldName', {}, undefined)).toEqual(
        {
          items: [
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
        }
      )
    })

    it('should build date parts with errors and with values (month and year)', () => {
      const errors = { fieldName: { text: 'Error message for field' } }
      expect(
        buildMonthYearValuesAndErrors(
          'fieldName',
          { fieldName: ['13', '3000'] },
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
            value: '3000'
          }
        ]
      })
    })
  })
})
