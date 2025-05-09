/**
 * Splits the current full URL to extract the base editor part, then adds the supplied path,
 * re-adding the stateId if required
 * @param {string} href
 * @param {string} path
 * @param {boolean} [includeStateId]
 */
export function addPathToEditorBaseUrl(href, path, includeStateId = false) {
  const urlBaseEnd = href.indexOf('/editor-v2/')
  const urlLastSlash = href.lastIndexOf('/')
  return includeStateId
    ? `${href.substring(0, urlBaseEnd + 10)}${path}${href.substring(urlLastSlash + 1)}`
    : `${href.substring(0, urlBaseEnd + 10)}${path}`
}
