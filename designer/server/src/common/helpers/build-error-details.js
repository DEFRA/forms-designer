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
 * @typedef {import('@hapi/hapi').Request["payload"]} Payload
 * @typedef {import('joi').ValidationErrorItem} ValidationErrorItem
 * @typedef {Record<string, { message: string }>} ErrorDetails
 */
