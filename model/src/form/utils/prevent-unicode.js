/**
 * Custom Joi validator to prevent Unicode characters in say an email address.
 * Although Joi has Joi.email({ allowUnicode: false }), we can't differentiate from a general
 * email format error or a Unicode error - hance the custom validator to allow a different error message
 * @param {unknown} value
 * @param {CustomHelpers<string>} helpers
 */
export function preventUnicodeInEmail(value, helpers) {
  if (!value || typeof value !== 'string') {
    return helpers.error('string.empty')
  }
  const invalidCharsRegex = /[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/
  const invalid = invalidCharsRegex.exec(value)
  return invalid ? helpers.error('string.unicode') : value
}

/**
 * @import { type CustomHelpers } from 'joi'
 */
