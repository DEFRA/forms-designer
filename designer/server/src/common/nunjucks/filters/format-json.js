import serialize from 'serialize-javascript'

/**
 * @param {object} value
 */
export function formatJSON(value) {
  return serialize(value, { isJSON: true })
}
