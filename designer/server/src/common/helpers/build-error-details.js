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
 */
export function buildErrorList(errorDetails) {
  if (!errorDetails) {
    return []
  }

  return Object.entries(errorDetails).map(([, message]) => message)
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
