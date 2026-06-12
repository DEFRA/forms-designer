import { isValid, parseISO } from 'date-fns'

import { insertValidationErrors } from '~/src/lib/utils.js'

const ERROR_CLASS = ' govuk-input--error'

/**
 * @param {any} value
 * @param {number} partCount
 */
export const isValidDatePartsPayload = (value, partCount) => {
  return Array.isArray(value) && value.length === partCount
}

/**
 * @param {Root} joi
 * @param {NumberSchema<number>[]} partSchemas
 * @param {number} partCount
 */
export function setupDatePartsSchema(joi, partSchemas, partCount) {
  const emptyString = joi.string().trim().valid('').required()

  return {
    partsSchema: /** @type {ArraySchema<number[]>} */ (
      joi
        .array()
        .ordered(...partSchemas)
        .length(partCount)
    ),
    emptyPayload: /** @type {ArraySchema<''[]>} */ (
      joi
        .array()
        .items(...Array.from({ length: partCount }, () => emptyString))
        .length(partCount)
    )
  }
}

/**
 * @param {any} value
 * @param {ArraySchema<''[]>} emptyPayload
 * @param {number} partCount
 */
export function prepareDatePartsValue(value, emptyPayload, partCount) {
  if (!isValidDatePartsPayload(value, partCount)) {
    return { value }
  }

  // Treat all empty strings as empty and let the base type handle it.
  const { error } = emptyPayload.validate(value)

  if (!error) {
    return { value: undefined }
  }

  return { value }
}

/**
 * @param {any} value
 * @param {any} helpers
 * @param {{
 *   partsSchema: ArraySchema<number[]>
 *   partCount: number
 *   elementLookup: string[]
 *   buildDateString: (parts: number[]) => string
 * }} options
 */
export function coerceDatePartsValue(value, helpers, options) {
  if (!isValidDatePartsPayload(value, options.partCount)) {
    return { value }
  }

  const key = helpers.state.path[0]
  const { error, value: coerced } = options.partsSchema.validate(value, {
    abortEarly: false
  })

  if (error) {
    const errors = helpers.errorsArray()

    error.details.forEach((err) => {
      const customContext = { ...err.context, key }

      if (err.type === 'number.base') {
        const elemName =
          typeof err.context?.key === 'number' &&
          err.context.key < options.partCount
            ? options.elementLookup[err.context.key]
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

  const date = parseISO(options.buildDateString(coerced))

  if (!isValid(date)) {
    return {
      value,
      errors: helpers.error('date.base', { key })
    }
  }

  return { value: date }
}

/**
 * @param {string} fieldName
 * @param {Record<string, string | string[] | number | boolean | undefined> } values
 * @param {ErrorDetails | undefined} errors
 * @param {Array<{ idSuffix: string, label: string, classes: string }>} fields
 */
export function buildDatePartsValuesAndErrors(
  fieldName,
  values,
  errors,
  fields
) {
  const parts =
    /** @type {string[]} */ (values[fieldName]) ?? fields.map(() => '')

  const dateErrors = errors ? errors[fieldName] : undefined

  return {
    items: fields.map((field, index) => {
      return {
        id: `${fieldName}-${field.idSuffix}`,
        name: fieldName,
        label: field.label,
        autocomplete: 'off',
        value: /** @type { string | undefined } */ (parts[index]),
        classes: field.classes + (dateErrors ? ERROR_CLASS : '')
      }
    }),
    ...insertValidationErrors(dateErrors)
  }
}

/**
 * @import { Root, ArraySchema, NumberSchema } from 'joi'
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
