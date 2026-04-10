import { type CustomHelpers } from 'joi'
import slug from 'slug'

/**
 * Replace whitespace, en-dashes and em-dashes with spaces
 * before running through the slug package
 */
export function slugify(input = '', options?: slug.Options) {
  const string = input.trimStart().replace(/[\s–—]/g, ' ')

  return slug(string, {
    fallback: false,
    lower: true,
    trim: true,
    ...options
  })
}

/**
 * Safely extracts error message from unknown error types
 * @param {unknown} error - The error to extract message from
 * @returns {string} The error message
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Custom Joi validator to prevent Unicode characters in say an email address.
 * Although Joi has Joi.email({ allowUnicode: false }), we can't differentiate from a general
 * email format error or a Unicode error - hance the custom validator to allow a different error message
 * @param {CustomHelpers<string>} value
 * @param {unknown} helpers
 */
export function preventUnicodeInEmail(
  value: unknown,
  helpers: CustomHelpers<string>
) {
  if (!value || typeof value !== 'string') {
    return helpers.error('string.empty')
  }
  const invalidCharsRegex = /[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/
  const invalid = invalidCharsRegex.exec(value)
  return invalid ? helpers.error('string.unicode') : value
}
