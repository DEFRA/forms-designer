/**
 * @param {ValidationError} error
 */
export function buildErrorDetails(error) {
  return error.details.reduce((errors, { context, message }) => {
    if (!context?.key) {
      return errors
    }

    return {
      ...errors,
      [context.key]: {
        text: message,
        href: `#${context.key}`
      }
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
 * @param {ValidationError} list1
 * @param {ValidationError} list2
 */
export function combineErrorLists(list1, list2) {
  const details = list1.details.concat(list2.details)
  list1.details = details
  return list1
}

/**
 * @import { ValidationError } from 'joi'
 * @import { ErrorDetails, ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
