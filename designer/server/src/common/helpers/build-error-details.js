/**
 * @param {ErrorDetails} errors
 * @param {ValidationErrorItem} errorItem
 */
export function buildListErrorDetail(errors, { context, message }) {
  const position = /** @type {string|undefined} */ (context?.pos)
  const matchString = `[${position}]`

  if (position === undefined || !context?.label?.includes(matchString)) {
    return errors
  }

  const key = context.label.replace(`[${position}]`, '')
  const linePosition = parseInt(position) + 1

  return {
    ...errors,
    [key]: {
      text: `${message} on item ${linePosition}`,
      href: `#${key}`
    }
  }
}

/**
 * @param {ValidationError} error
 */
export function buildErrorDetails(error) {
  return error.details.reduce((errors, validationErrorItem) => {
    const { context, message } = validationErrorItem
    if (context?.pos !== undefined) {
      return buildListErrorDetail(errors, validationErrorItem)
    }

    if (!context?.label) {
      return errors
    }

    return {
      ...errors,
      [context.label]: {
        text: message,
        href: `#${context.label}`
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
 * @import { ValidationError, ValidationErrorItem } from 'joi'
 * @import { ErrorDetails, ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
