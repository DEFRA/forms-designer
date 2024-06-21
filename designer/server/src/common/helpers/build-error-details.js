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
 * @param {string[]} errorList
 * @returns {ErrorDetailsItem[]}
 */
export function buildSimpleErrorList(errorList) {
  return errorList.map((message) => {
    return { text: message }
  })
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
 * @typedef {{ text: string, href?: string }} ErrorDetailsItem
 * @typedef {Record<string, ErrorDetailsItem>} ErrorDetails
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
