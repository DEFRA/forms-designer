import {
  formsAboutPath,
  formsFeaturesPath,
  formsGetStartedPath,
  formsLibraryPath,
  formsResourcesPath,
  formsSupportPath,
  formsWebsitePaths
} from '~/src/models/links.js'

/**
 * @param {string} text
 * @param {string} url
 * @param {{ isActive: boolean; isVisible?: boolean }} [options]
 */
export function buildEntry(text, url, options) {
  return {
    text,
    url,
    isActive: !!options?.isActive,
    isVisible: options?.isVisible ?? true
  }
}

/**
 * @param { string | undefined } path
 * @param { string } pathChecked
 */
export function isVisible(path, pathChecked) {
  if (path !== undefined && formsWebsitePaths.includes(pathChecked)) {
    return formsWebsitePaths.some((websitePath) => {
      return path.includes(websitePath)
    })
  }

  return true
}

/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    buildEntry('Forms library', formsLibraryPath, {
      isActive: !!request?.path?.startsWith(formsLibraryPath)
    }),
    buildEntry('About', formsAboutPath, {
      isActive: !!request?.path?.startsWith(formsAboutPath),
      isVisible: isVisible(request?.path, formsAboutPath)
    }),
    buildEntry('Get started', formsGetStartedPath, {
      isActive: !!request?.path?.startsWith(formsGetStartedPath),
      isVisible: isVisible(request?.path, formsGetStartedPath)
    }),
    buildEntry('Features', formsFeaturesPath, {
      isActive: !!request?.path?.startsWith(formsFeaturesPath),
      isVisible: isVisible(request?.path, formsFeaturesPath)
    }),
    buildEntry('Resources', formsResourcesPath, {
      isActive: !!request?.path?.startsWith(formsResourcesPath),
      isVisible: isVisible(request?.path, formsResourcesPath)
    }),
    buildEntry('Support', formsSupportPath, {
      isActive: !!request?.path?.startsWith(formsSupportPath)
    })
  ]
    .filter(({ isVisible }) => isVisible)
    .map(({ isVisible: _isVisible, ...entry }) => {
      return entry
    })
}

/**
 * @import { Request } from '@hapi/hapi'
 */
