const EDITOR_V2_FOLDER = '/editor-v2/'
const EDITOR_V2_FOLDER_NO_TRAILING_SLASH = '/editor-v2'

/**
 * Splits the current full URL to extract the base editor part, then adds the supplied path,
 * re-adding the stateId if required
 * @param {string} href
 * @param {string} path
 * @param {boolean} [includeStateId]
 */
export function addPathToEditorBaseUrl(href, path, includeStateId = false) {
  const [baseUrl, remainingPath] = href.split(EDITOR_V2_FOLDER)
  const stateId =
    includeStateId && remainingPath ? `${remainingPath.split('/').pop()}` : ''
  return path.startsWith('/')
    ? `${baseUrl}${EDITOR_V2_FOLDER_NO_TRAILING_SLASH}${path}${stateId}`
    : `${baseUrl}${EDITOR_V2_FOLDER}${path}${stateId}`
}

/**
 * @param { HTMLElement | null } el
 */
export function hideHtmlElement(el) {
  if (el) {
    el.style.display = 'none'
  }
}

/**
 * @param { HTMLElement | null } el
 */
export function showHtmlElement(el) {
  if (el) {
    el.style.display = 'block'
  }
}

/**
 * @param { HTMLElement | null } el
 * @param {boolean} show
 */
export function showHideHtmlElement(el, show) {
  if (show) {
    showHtmlElement(el)
  } else {
    hideHtmlElement(el)
  }
}
