import { isValid, parseISO } from 'date-fns'

import {
  insertValidationErrors,
  leftPadDateIfSupplied
} from '~/src/lib/utils.js'

const BASE_ERROR = '{{#label}} must be a real date'
const ERROR_CLASS = ' govuk-input--error'
const NUMBER_OF_DATE_PARTS = 2

const elementLookup = ['month', 'year']

/**
 * @param {any} value
 */
const isValidArrayPayload = (value) => {
  return Array.isArray(value) && value.length === NUMBER_OF_DATE_PARTS
}

const errorMessages = {
  'number.max': BASE_ERROR,
  'number.min': BASE_ERROR,
  'date.base': BASE_ERROR,
  'dateParts.base': BASE_ERROR,
  'dateParts.month.required': '{{#label}} must include a month',
  'dateParts.year.required': '{{#label}} must include a year'
}

/**
 * @param {import('joi').Root} joi
 */
function setupSchema(joi) {
  const monthSchema = joi.number().min(1).max(12)
  const yearSchema = joi.number().min(1000).max(3000)
  const emptyString = joi.string().trim().valid('').required()

  return {
    partsSchema: /** @type {import('joi').ArraySchema<number[]>} */ (
      joi
        .array()
        .ordered(monthSchema.required(), yearSchema.required())
        .length(NUMBER_OF_DATE_PARTS)
    ),
    emptyPayload: joi
      .array()
      .items(emptyString, emptyString)
      .length(NUMBER_OF_DATE_PARTS)
  }
}

/**
 * @param {any} value
 * @param {ArraySchema<any[]>} emptyPayload
 */
function prepareImpl(value, emptyPayload) {
  if (!isValidArrayPayload(value)) {
    return { value }
  }

  // Treat two empty strings as
  // empty and let the base type handle it
  const { error } = emptyPayload.validate(value)
  const isEmpty = !error

  if (isEmpty) {
    return { value: undefined }
  }

  return { value }
}

/**
 * @type {import('joi').ExtensionFactory}
 */
export const gdsMonthYearExtension = (joi) => {
  const { partsSchema, emptyPayload } = setupSchema(joi)

  return {
    base: joi.date(),
    type: 'gdsMonthYearParts',
    messages: errorMessages,
    /**
     * @param {any} value
     * @param {any} _helpers
     */
    prepare(value, _helpers) {
      return prepareImpl(value, emptyPayload)
    },
    coerce: {
      from: 'object',
      /**
       * @param {any} value
       * @param {any} helpers
       */
      method: function (value, helpers) {
        if (!isValidArrayPayload(value)) {
          return { value }
        }

        const key = helpers.state.path[0]
        const { error, value: coerced } = partsSchema.validate(value, {
          abortEarly: false
        })

        if (error) {
          const details = error.details
          const errors = helpers.errorsArray()

          details.forEach((err) => {
            const customContext = { ...err.context, key }
            if (err.type === 'number.base') {
              const elemName =
                typeof err.context?.key === 'number' &&
                err.context.key < NUMBER_OF_DATE_PARTS
                  ? elementLookup[err.context.key]
                  : ''

              if (elemName) {
                errors.push(
                  helpers.error(`dateParts.${elemName}.required`, customContext)
                )
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

        const date = parseISO(
          `${coerced[1]}-${leftPadDateIfSupplied(coerced[0].toString())}-01`
        )

        if (!isValid(date)) {
          return {
            value,
            errors: helpers.error('date.base', { key })
          }
        }

        return { value: date }
      }
    }
  }
}

/**
 * @param {string} fieldName
 * @param {Record<string, string | string[] | number | boolean | undefined> } values
 * @param {ErrorDetails | undefined} errors
 */
export function buildMonthYearValuesAndErrors(fieldName, values, errors) {
  const parts = /** @type {string[]} */ (values[fieldName]) ?? ['', '']

  const dateErrors = errors ? errors[fieldName] : undefined

  return {
    items: [
      {
        id: `${fieldName}-month`,
        name: fieldName,
        label: 'Month',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[0]),
        classes: 'govuk-input--width-2' + (dateErrors ? ERROR_CLASS : '')
      },
      {
        id: `${fieldName}-year`,
        name: fieldName,
        label: 'Year',
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[1]),
        classes: 'govuk-input--width-4' + (dateErrors ? ERROR_CLASS : '')
      }
    ],
    ...insertValidationErrors(dateErrors)
  }
}

/**
 * @import { ArraySchema } from 'joi'
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
