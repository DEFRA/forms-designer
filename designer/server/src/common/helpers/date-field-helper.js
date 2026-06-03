import { isValid, parse } from 'date-fns'

import { leftPadDateIfSupplied } from '~/src/createServer.js'
import { insertValidationErrors } from '~/src/lib/utils.js'

/**
 * @param {string[] | undefined } value 
 * @returns 
 */
const isValidArrayPayload = (value) => {
  if (Array.isArray(value) && value.length === 3) {
    return true
  }

  return false
}

export const gdsDateExtension = joi => {
  const daySchema = joi.number().min(1).max(31)
  const monthSchema = joi.number().min(1).max(12)
  const yearSchema = joi.number().min(1000).max(3000)
  const partsSchema = joi.array().ordered(
    daySchema.required(),
    monthSchema.required(),
    yearSchema.required()
  ).length(3)
  const emptyString = joi.string().trim().valid('').required()
  const emptyPayload = joi.array().items(emptyString, emptyString, emptyString).length(3)

  return {
    base: joi.date(),
    type: 'dateParts',
    messages: {
      'dateParts.base': '{{#label}} must be a real date',
      'dateParts.day.required': '{{#label}} must include a day',
      'dateParts.month.required': '{{#label}} must include a month',
      'dateParts.year.required': '{{#label}} must include a year',
      'dateParts.round': '{{#label}} must be a round number',
      'dateParts.dividable': '{{#label}} must be dividable by {{#q}}'
    },
    prepare (value, helpers) {
      if (!isValidArrayPayload(value)) {
        return { value }
      }

      // Treat three empty strings as
      // empty and let the base type handle it
      const { error } = emptyPayload.validate(value)
      const isEmpty = !error

      if (isEmpty) {
        return { value: undefined }
      }

      return { value }
    },
    coerce: {
      from: 'object',
      method: function (value, helpers) {
        if (value instanceof Date || !isValidArrayPayload(value)) {
          return { value }
        }

        const { error, value: coerced } = partsSchema.validate(value, { abortEarly: false })

        if (error) {
          const errors = helpers.errorsArray()

          error.details.forEach(err => {
            if (err.type === 'number.base') {
              switch (err.context.key) {
                case 0:
                  errors.push(helpers.error('dateParts.day.required', err.context))
                  break
                case 1:
                  errors.push(helpers.error('dateParts.month.required', err.context))
                  break
                case 2:
                  errors.push(helpers.error('dateParts.year.required', err.context))
                  break
                default:
                  break
              }
            } else {
              errors.push(helpers.error(err.type, err.context))
            }
          })

          return {
            value: coerced,
            errors
          }
        }

        const dayStr = `${coerced[0]}`
        const monthStr = `${coerced[1]}`
        try {
          const date = parse(`${leftPadDateIfSupplied(dayStr)}/${leftPadDateIfSupplied(monthStr)}/${coerced[2]}`, 'dd/MM/yyyy', new Date())
          if (!isValid(date)) {
            throw new Error('invalid date')
          }

          return { value: date }
        } catch {
          return { value: coerced, errors: helpers.error('date.base') }
        }
      }
    }
  }
}

/**
 * @param {string} fieldName
 * @param {Record<string, string | string[] | number | boolean | undefined> } values
 * @param {ErrorDetails | undefined} errors
 */
export function buildDateValuesAndErrors(fieldName, values, errors) {
  const parts = /** @type {string[]} */ (values[fieldName]) ?? ['', '', '']

  const dateErrors = errors ? errors[fieldName] : undefined

  return {
    items: [
      {
        id: `${fieldName}-day`,
        name: fieldName,
        label: 'Day',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[0]),
        classes:
          'govuk-input--width-2' + (dateErrors ? ' govuk-input--error' : '')
      },
      {
        id: `${fieldName}-month`,
        name: fieldName,
        label: 'Month',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[1]),
        classes:
          'govuk-input--width-2' +
          (dateErrors ? ' govuk-input--error' : '')
      },
      {
        id: `${fieldName}-year`,
        name: fieldName,
        label: 'Year',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[2]),
        classes:
          'govuk-input--width-4' +
          (dateErrors ? ' govuk-input--error' : '')
      }
    ],
    ...insertValidationErrors(dateErrors)
  }
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
