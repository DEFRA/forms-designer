/**
 * @param {ValidationError} error
 */
export function buildErrorDetails(error) {
  return error.details.reduce((errors, { context, message }) => {
    if (!context?.key) {
      return errors
    }

    return {
      [context.key]: {
        text: message,
        href: `#${context.key}`
      },
      ...errors
    }
  }, /** @type {ErrorDetails} */ ({}))
}

/**
 * @param {ErrorDetails | undefined} errorDetails
 * @param {string[]} [names] - Field names to filter error list by
 */
export function buildErrorList(errorDetails, names) {
  if (!errorDetails) {
    return []
  }

  return Object.entries(errorDetails)
    .filter(([key]) => names?.includes(key) ?? true)
    .map(([, message]) => message)
}

/**
 * @typedef {import('joi').ValidationError} ValidationError
 * @typedef {Record<string, { text: string, href: string }>} ErrorDetails
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
