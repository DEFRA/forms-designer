import {
  pageNavigationBase,
  pageNavigationGuest
} from '~/src/routes/website/index.js'

/**
 * @typedef {{
 *  text: string;
 *  href: string;
 *  parent?: boolean;
 *  current?: boolean;
 *  classes?: string;
 *  children?: XGovSubNavigationItem[]
 * }} XGovSubNavigationItem
 */

/**
 * @typedef {{
 *  param: string;
 *  text: string;
 *  parent?: boolean;
 *  current?: boolean;
 *  classes?: string;
 *  children?: XGovContentSubNavigationItem[]
 * }} XGovContentSubNavigationItem
 */

/**
 *
 * @param { WebsiteLevel1Routes | undefined } route
 * @param {boolean} isGuest
 * @returns {{
 *   url: WebsiteLevel1Routes | string
 *   isActive?: boolean
 *   text: string
 * }[]}
 */
export function getWebsitePageNavigation(route, isGuest) {
  const pageNavigation = isGuest ? pageNavigationGuest : pageNavigationBase
  return pageNavigation.map(({ param, ...item }) => {
    const url = `/${param}`
    if (param === route) {
      return {
        ...item,
        url,
        isActive: true
      }
    }
    return { ...item, url }
  })
}

/**
 * @param { WebsiteLevel1Routes } parent
 * @param { Level2GetStartedMenu | Level2ResourcesMenu } activeMenu
 */
export function getSubnavigation(parent, activeMenu) {
  /**
    @param { Omit<XGovContentSubNavigationItem, 'children'> & { children: XGovContentSubNavigationItem[] } } menu
   */
  return function ({ param: parentParam, ...menu }) {
    return {
      ...menu,
      href: `/${parentParam}`,
      children: menu.children.map(({ param, ...subMenu }) => {
        const href = `/${parent}/${param}`

        if (param === activeMenu) {
          return {
            ...subMenu,
            href,
            current: true
          }
        }
        return { ...subMenu, href }
      })
    }
  }
}

/**
 * @typedef {{
 *   param: string;
 *   text: string;
 * }} SubMenuItem
 */

/**
 * @typedef {{
 *   href: string;
 *   labelText: string;
 * }} PaginatorItem
 */
/**
 * Zips menulist, and menulist shifted to the right and to the left - returning key, value entries
 * @param {XGovContentSubNavigationItem} currentMenu
 * @returns {Map<string, { previous?: PaginatorItem; next?: PaginatorItem }>}
 */
export function getSubmenuPaginatorMap(currentMenu) {
  const paginationList =
    currentMenu.children?.map(({ text, ...child }) => {
      return {
        href: `/${currentMenu.param}/${child.param}`,
        labelText: text
      }
    }) ?? []
  /**
   * Shifts the array one index to the right, filling with `undefined`
   * @type {( PaginatorItem |undefined )[]}
   */
  const previous = [undefined, ...paginationList]
  /**
   * Shifts the array one index to the left (undefined added for readability only)
   * @type {( PaginatorItem | undefined )[]}
   */
  const next = [...paginationList.slice(1), undefined]

  return new Map(
    currentMenu.children?.map(({ param }, idx) => [
      param,
      {
        previous: previous[idx],
        next: next[idx]
      }
    ]) ?? []
  )
}
/**
 * @import { WebsiteLevel1Routes, Level2GetStartedMenu, Level2ResourcesMenu } from '~/src/routes/website/constants.js'
 */
