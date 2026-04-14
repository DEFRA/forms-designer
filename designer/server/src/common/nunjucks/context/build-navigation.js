import {
  formsFeaturesPath,
  formsLibraryPath,
  formsMakingAFormPath,
  formsResourcesPath,
  formsSupportPath
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
// export function isVisible(path, pathChecked) {
//   if (path !== undefined && formsWebsitePaths.includes(pathChecked)) {
//     return formsWebsitePaths.some((websitePath) => {
//       return path.includes(websitePath)
//     })
//   }

//   return true
// }

/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    buildEntry('HomeX', formsLibraryPath, {
      isActive: !!request?.path?.startsWith(formsLibraryPath)
    }),
    buildEntry('Features', formsFeaturesPath, {
      isActive: !!request?.path?.startsWith(formsFeaturesPath)
    }),
    buildEntry('Making a form', formsMakingAFormPath, {
      isActive: !!request?.path?.startsWith(formsMakingAFormPath)
    }),
    buildEntry('Resources', formsResourcesPath, {
      isActive: !!request?.path?.startsWith(formsResourcesPath),
      isVisible: request?.auth?.isAuthenticated
    }),
    buildEntry('Support', formsSupportPath, {
      isActive: !!request?.path?.startsWith(formsSupportPath)
    })
  ].filter(({ isVisible }) => isVisible)
  // .map(({ isVisible: _isVisible, ...entry }) => {
  //   return entry
  // })
}

/**
 * @param {string} activePage
 */
export function buildAdminNavigation(activePage) {
  const navigationItems = [
    ['My account', '/auth/account'],
    ['Manage users', '/manage/users'],
    ['Admin tools', '/admin/index'],
    ['Support', '/support']
  ]

  return navigationItems.map(([menuName, path]) =>
    buildEntry(menuName, path, { isActive: menuName === activePage })
  )
}

/**
 * @import { Request } from '@hapi/hapi'
 */
