import {
  formsAboutPath,
  formsFeaturesPath,
  formsGetStartedPath,
  formsLibraryPath,
  formsResourcesPath,
  formsSupportPath
} from '~/src/models/links.js'

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
    }),
    buildEntry('About', formsAboutPath, {
      isActive: !!request?.path?.startsWith(formsAboutPath)
    }),
    buildEntry('Get started', formsGetStartedPath, {
      isActive: !!request?.path?.startsWith(formsGetStartedPath)
    }),
    buildEntry('Features', formsFeaturesPath, {
      isActive: !!request?.path?.startsWith(formsFeaturesPath)
    }),
    buildEntry('Resources', formsResourcesPath, {
      isActive: !!request?.path?.startsWith(formsResourcesPath)
    }),
    buildEntry('Support', formsSupportPath, {
      isActive: !!request?.path?.startsWith(formsSupportPath)
    })
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
