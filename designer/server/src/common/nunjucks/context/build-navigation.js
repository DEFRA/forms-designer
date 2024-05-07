/**
 * @param {Partial<Request> | null} request
 * @param {string} text
 * @param {string} url
 */
function buildEntry(request, text, url) {
  return {
    text,
    url,
    isActive: request?.path === url
  }
}

/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    buildEntry(request, 'Home', '/'),
    buildEntry(request, 'Forms library', '/library')
  ]
}

/**
 * @typedef {import('@hapi/hapi').Request} Request
 */
