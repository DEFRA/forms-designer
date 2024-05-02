/**
 * @param {string | number} [val]
 */
export function tryParseInt(val = '') {
  const parsed = parseInt(`${val}`, 10)
  return isNaN(parsed) ? undefined : parsed
}

/**
 * @param {number} [val]
 * @returns {val is number}
 */
export function isInt(val) {
  const int = parseInt(`${val}`, 10)
  return !isNaN(int)
}
