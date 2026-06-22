import {
  buildDatePartsValuesAndErrors,
  coerceDatePartsValue,
  prepareDatePartsValue,
  setupDatePartsSchema
} from '~/src/common/helpers/date-parts-field-helper.js'
import { leftPadDateIfSupplied } from '~/src/lib/utils.js'

const BASE_ERROR = '{{#label}} must be a real date'
const NUMBER_OF_DATE_PARTS = 2

const elementLookup = ['month', 'year']
const partFields = [
  { idSuffix: 'month', label: 'Month', classes: 'govuk-input--width-2' },
  { idSuffix: 'year', label: 'Year', classes: 'govuk-input--width-4' }
]

/**
 * @param {number[]} coerced
 */
function buildDateString(coerced) {
  return `${coerced[1]}-${leftPadDateIfSupplied(coerced[0].toString())}-01`
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
 * @param {Root} joi
 */
function setupSchema(joi) {
  const monthSchema = joi.number().min(1).max(12)
  const yearSchema = joi.number().min(1000).max(3000)

  return setupDatePartsSchema(
    joi,
    [monthSchema.required(), yearSchema.required()],
    NUMBER_OF_DATE_PARTS
  )
}

/**
 * @param {any} value
 * @param {ArraySchema<''[]>} emptyPayload
 */
function prepareImpl(value, emptyPayload) {
  return prepareDatePartsValue(value, emptyPayload, NUMBER_OF_DATE_PARTS)
}

/**
 * @type {ExtensionFactory}
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
export function buildMonthYearValuesAndErrors(fieldName, values, errors) {
  return buildDatePartsValuesAndErrors(fieldName, values, errors, partFields)
}

/**
 * @import { Root, ArraySchema, ExtensionFactory } from 'joi'
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
