import { isValid, parse } from 'date-fns'

import {
  insertValidationErrors,
  leftPadDateIfSupplied
} from '~/src/lib/utils.js'

const BASE_ERROR = '{{#label}} must be a real date'
const numOfDateParts = 3

/**
 * @param {string[] | undefined } value
 */
const isValidArrayPayload = (value) => {
  if (Array.isArray(value) && value.length === numOfDateParts) {
    return true
  }

  return false
}

/**
 * @type {import('joi').ExtensionFactory}
 */
export const gdsDateExtension = (joi) => {
  const daySchema = joi.number().min(1).max(31)
  const monthSchema = joi.number().min(1).max(12)
  const yearSchema = joi.number().min(1000).max(3000)
  const partsSchema = joi
    .array()
    .ordered(
      daySchema.required(),
      monthSchema.required(),
      yearSchema.required()
    )
    .length(numOfDateParts)
  const emptyString = joi.string().trim().valid('').required()
  const emptyPayload = joi
    .array()
    .items(emptyString, emptyString, emptyString)
    .length(numOfDateParts)

  return {
    base: joi.date(),
    type: 'gdsDateParts',
    messages: {
      'number.max': BASE_ERROR,
      'number.min': BASE_ERROR,
      'dateParts.base': BASE_ERROR,
      'dateParts.day.required': '{{#label}} must include a day',
      'dateParts.month.required': '{{#label}} must include a month',
      'dateParts.year.required': '{{#label}} must include a year'
    },
    /**
     * @param {any} value
     * @param {any} _helpers
     */
    prepare(value, _helpers) {
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
      /**
       * @param {any} value
       * @param {any} helpers
       */
      method: function (value, helpers) {
        if (value instanceof Date || !isValidArrayPayload(value)) {
          return { value }
        }

        const { error, value: coerced } = partsSchema.validate(value, {
          abortEarly: false
        })

        const key = helpers.state.path[0]

        if (error) {
          const errors = helpers.errorsArray()

          const details =
            /** @type {Array<{ type: string, context: { key: any } }>} */ (
              error.details
            )
          details.forEach((err) => {
            const customContext = Object.assign({}, err.context, {
              key
            })
            if (err.type === 'number.base') {
              switch (err.context.key) {
                case 0:
                  errors.push(
                    helpers.error('dateParts.day.required', customContext)
                  )
                  break
                case 1:
                  errors.push(
                    helpers.error('dateParts.month.required', customContext)
                  )
                  break
                case 2:
                  errors.push(
                    helpers.error('dateParts.year.required', customContext)
                  )
                  break
                default:
                  break
              }
            } else {
              errors.push(helpers.error(err.type, customContext))
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
          const date = parse(
            `${leftPadDateIfSupplied(dayStr)}/${leftPadDateIfSupplied(monthStr)}/${coerced[2]}`,
            'dd/MM/yyyy',
            new Date()
          )
          if (!isValid(date)) {
            throw new Error('invalid date')
          }

          return { value: date }
        } catch {
          return {
            value: coerced,
            errors: helpers.error('date.base', { key })
          }
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
          'govuk-input--width-2' + (dateErrors ? ' govuk-input--error' : '')
      },
      {
        id: `${fieldName}-year`,
        name: fieldName,
        label: 'Year',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[2]),
        classes:
          'govuk-input--width-4' + (dateErrors ? ' govuk-input--error' : '')
      }
    ],
    ...insertValidationErrors(dateErrors)
  }
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
