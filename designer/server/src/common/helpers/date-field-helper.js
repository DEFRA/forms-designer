import { isValid, parse } from 'date-fns'

import { leftPadDateIfSupplied } from '~/src/createServer.js'
import { insertValidationErrors } from '~/src/lib/utils.js'

/**
 * @param {string[] | undefined } value
 */
const isValidArrayPayload = (value) => {
  if (Array.isArray(value) && value.length === 3) {
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
    .length(3)
  const emptyString = joi.string().trim().valid('').required()
  const emptyPayload = joi
    .array()
    .items(emptyString, emptyString, emptyString)
    .length(3)

  return {
    base: joi.date(),
    type: 'gdsDateParts',
    /**
     * @param {import('joi').AnySchema} schema
     * @param {...import('joi').SchemaLike} args
     */
    args(schema, ...args) {
      if (!args.length) {
        return schema
      }

      const arg = /** @type {{ key: string, label: string }} */ (args[0])
      if (typeof arg !== 'object') {
        return schema
      }

      const key = arg.key
      const label = arg.label
      if (typeof key !== 'string' || typeof label !== 'string') {
        return schema
      }

      const existingLabels = schema._flags._gdsLabels ?? {}
      existingLabels[key] = label
      schema._flags = Object.assign({}, schema._flags, {
        _gdsLabels: existingLabels
      })
      // schema._flags._gdsLabels = existingLabels

      return schema
    },
    messages: {
      'number.max': '{{#customLabel}} must be a real date',
      'number.min': '{{#customLabel}} must be a real date',
      'dateParts.base': '{{#customLabel}} must be a real date',
      'dateParts.day.required': '{{#customLabel}} must include a day',
      'dateParts.month.required': '{{#customLabel}} must include a month',
      'dateParts.year.required': '{{#customLabel}} must include a year'
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

        if (error) {
          const errors = helpers.errorsArray()

          const details =
            /** @type {Array<{ type: string, context: { key: any } }>} */ (
              error.details
            )
          details.forEach((err) => {
            const customLabel = /** @type {any} */ (
              helpers?.schema?._flags?._gdsLabels[helpers.state.path[0]]
            )
            const customContext = Object.assign({}, err.context, {
              customLabel
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
          const customLabel = /** @type {any} */ (
            helpers?.schema?._flags?._gdsLabel
          )
          return {
            value: coerced,
            errors: helpers.error('date.base', { label: customLabel })
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
