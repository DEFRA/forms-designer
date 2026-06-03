import { insertValidationErrors } from '~/src/lib/utils.js'

/**
 * @param {string} fieldName
 * @param {Record<string, string | number | boolean | undefined> } values
 * @param {ErrorDetails | undefined} errors
 */
export function buildDateValuesAndErrors(fieldName, values, errors) {
  const dayField = `${fieldName}-day`
  const monthField = `${fieldName}-month`
  const yearField = `${fieldName}-year`

  const dateErrors = {
    day: errors ? errors[dayField] : undefined,
    month: errors ? errors[monthField] : undefined,
    year: errors ? errors[yearField] : undefined
  }

  return {
    items: [
      {
        name: 'day',
        value: /** @type { string | undefined } */ (values[dayField]),
        classes:
          'govuk-input--width-2' + (dateErrors.day ? ' govuk-input--error' : '')
      },
      {
        name: 'month',
        value: /** @type { string | undefined } */ (values[monthField]),
        classes:
          'govuk-input--width-2' +
          (dateErrors.month ? ' govuk-input--error' : '')
      },
      {
        name: 'year',
        value: /** @type { string | undefined } */ (values[yearField]),
        classes:
          'govuk-input--width-4' +
          (dateErrors.year ? ' govuk-input--error' : '')
      }
    ],
    ...insertValidationErrors(
      dateErrors.day ?? dateErrors.month ?? dateErrors.year
    )
  }
}

/**
 * @import { ErrorDetails } from '~/src/common/helpers/types.js'
 */
