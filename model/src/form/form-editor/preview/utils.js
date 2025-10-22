/**
 * @param {string} fieldName
 * @param { string | undefined } id
 */
export function buildCombinedId(fieldName, id) {
  const idSuffix = id ? `-${id}` : ''
  return `${fieldName}${idSuffix}`
}
