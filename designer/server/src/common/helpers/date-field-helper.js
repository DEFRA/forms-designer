import {
  buildDatePartsValuesAndErrors,
  coerceDatePartsValue,
  prepareDatePartsValue,
  setupDatePartsSchema
} from '~/src/common/helpers/date-parts-field-helper.js'
import { leftPadDateIfSupplied } from '~/src/lib/utils.js'

const BASE_ERROR = '{{#label}} must be a real date'
const NUMBER_OF_DATE_PARTS = 3

const elementLookup = ['day', 'month', 'year']
const partFields = [
  { idSuffix: 'day', label: 'Day', classes: 'govuk-input--width-2' },
  { idSuffix: 'month', label: 'Month', classes: 'govuk-input--width-2' },
  { idSuffix: 'year', label: 'Year', classes: 'govuk-input--width-4' }
]

/**
 * @param {any[]} coerced
 */
function buildDateString(coerced) {
  return `${coerced[2]}-${leftPadDateIfSupplied(coerced[1].toString())}-${leftPadDateIfSupplied(coerced[0].toString())}`
}

const errorMessages = {
  'number.max': BASE_ERROR,
  'number.min': BASE_ERROR,
  'date.base': BASE_ERROR,
  'dateParts.base': BASE_ERROR,
  'dateParts.day.required': '{{#label}} must include a day',
  'dateParts.month.required': '{{#label}} must include a month',
  'dateParts.year.required': '{{#label}} must include a year'
}

/**
 * @param {import('joi').Root} joi
 */
function setupSchema(joi) {
  const daySchema = joi.number().min(1).max(31)
  const monthSchema = joi.number().min(1).max(12)
  const yearSchema = joi.number().min(1000).max(3000)

  return setupDatePartsSchema(
    joi,
    [daySchema.required(), monthSchema.required(), yearSchema.required()],
    NUMBER_OF_DATE_PARTS
  )
}

/**
 * @param {any} value
 * @param {import('joi').ArraySchema<any[]>} emptyPayload
 */
function prepareImpl(value, emptyPayload) {
  return prepareDatePartsValue(value, emptyPayload, NUMBER_OF_DATE_PARTS)
}

/**
 * @type {import('joi').ExtensionFactory}
 */
export const gdsDateExtension = (joi) => {
  const { partsSchema, emptyPayload } = setupSchema(joi)

  return {
    base: joi.date(),
    type: 'gdsDateParts',
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
        return coerceDatePartsValue(value, helpers, {
          partsSchema,
          partCount: NUMBER_OF_DATE_PARTS,
          elementLookup,
          buildDateString
        })
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
  return buildDatePartsValuesAndErrors(fieldName, values, errors, partFields)
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
