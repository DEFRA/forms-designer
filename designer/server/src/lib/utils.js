import { getTraceId } from '@defra/hapi-tracing'
import slug from 'slug'

import config from '~/src/config.js'

/**
 * Returns a set of headers to use in a http request`
 * @param {string} token
 * @returns {Parameters<typeof Wreck.request>[2]}
 */
export function getHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(getTraceId() ? { [config.tracing.header]: getTraceId() } : {})
    }
  }
}

/**
 * Replace whitespace, en-dashes and em-dashes with spaces
 * before running through the slug package
 * @param {string} input
 */
export function slugify(input = '', options = {}) {
  const string = input.trimStart().replace(/[\s–—]/g, ' ')

  return slug(string, {
    fallback: false,
    lower: true,
    trim: true,
    ...options
  })
}

/**
 *
 * @param {string | undefined} checkboxVal
 */
export function isCheckboxSelected(checkboxVal) {
  return checkboxVal === 'true' || checkboxVal === 'Y'
}

/**
 *
 * @param {string | undefined | null} str
 * @returns {boolean}
 */
export function stringHasValue(str) {
  if (!str) {
    return false
  }
  return str.length > 0
}

/**
 * @param {ErrorDetailsItem | undefined} formField
 */
export function insertValidationErrors(formField) {
  return {
    ...(formField && {
      errorMessage: {
        text: formField.text
      }
    })
  }
}

/**
 * Truncate a string and append an ellipsis (if necessary)
 * @param {string | undefined} strVal
 * @param {number} max
 */
export function ellipsise(strVal, max = 50) {
  if (!strVal) {
    return strVal
  }

  const len = strVal.length
  if (len <= max) {
    return strVal
  }

  return `${strVal.substring(0, max)}...`
}

/**
 * Replace line breaks with <br> for HTML rendering
 * @param {string | undefined} str
 */
export function nlToBr(str) {
  return str ? str.split('\n').join('<br>') : ''
}

/**
 * Ensure html is stripped of any possible injection risks
 * @param {string | undefined} str
 */
export function safeHtml(str) {
  return str ? str.replaceAll('<', '_').replaceAll('>', '_') : ''
}

/**
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import Wreck from '@hapi/wreck'
 */
