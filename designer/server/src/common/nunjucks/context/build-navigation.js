/**
 * @param {string} text
 * @param {string} url
 * @param {{ isActive: boolean }} [options]
 */
export function buildEntry(text, url, options) {
  return {
    text,
    url,
    isActive: !!options?.isActive
  }
}

/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    buildEntry('Forms library', '/library', {
      isActive: request?.path === '/library'
    })
  ]
}

/**
 * @typedef {import('@hapi/hapi').Request} Request
 */
