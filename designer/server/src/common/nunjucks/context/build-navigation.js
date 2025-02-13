import { formsLibraryPath } from '~/src/models/links.js'

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
    buildEntry('Forms library', formsLibraryPath, {
      isActive: !!request?.path?.startsWith(formsLibraryPath)
    })
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
