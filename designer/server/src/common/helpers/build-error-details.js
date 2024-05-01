/**
 * @param {ValidationErrorItem[]} errorDetails
 */
export function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      [detail.context?.key ?? 'unknown']: {
        message: detail.message
      },
      ...errors
    }
  }, /** @type {ErrorDetails} */ ({}))
}

/**
 * @typedef {import('joi').ValidationErrorItem} ValidationErrorItem
 * @typedef {Record<string, { message: string }>} ErrorDetails
 */

/**
 * @template {object} Schema
 * @typedef {import('@hapi/hapi').Request<{ Payload: Schema }>["payload"]} Payload
 */

/**
 * @template {object} [Schema=object]
 * @typedef {object} ValidationFailure
 * @property {ErrorDetails} formErrors - Formatted errors for error summary
 * @property {Payload<Schema>} formValues - Form POST payload from Hapi request
 */
