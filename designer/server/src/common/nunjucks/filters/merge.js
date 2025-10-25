/**
 * Nunjucks filter to get the page for a given path
 * @param {Record<string, any>} targetDictionary - Object to extend
 * @param {Record<string, any>} sourceDictionary - Object to merge into target
 */
export function merge(targetDictionary, sourceDictionary) {
  if (
    typeof targetDictionary !== 'object' ||
    typeof sourceDictionary !== 'object'
  ) {
    return targetDictionary
  }

  return {
    ...targetDictionary,
    ...sourceDictionary
  }
}
