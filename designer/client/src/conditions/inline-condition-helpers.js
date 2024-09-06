/**
 * @param {string | number} [val]
 */
export function tryParseInt(val = '') {
  const parsed = parseInt(`${val}`, 10)
  return isNaN(parsed) ? undefined : parsed
}
