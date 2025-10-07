import { pageNavigationBase } from '~/src/routes/website/index.js'

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
 *
 * @param { WebsiteLevel1Routes } route
 * @returns {{
 *   href: WebsiteLevel1Routes | string
 *   text: string
 * }[]}
 */
export function getWebsitePageNavigation(route) {
  return pageNavigationBase.map((item) => {
    if (item.href === route) {
      return {
        ...item,
        active: true
      }
    }
    return item
  })
}

/**
 * @param { Level2GetStartedMenu | Level2ResourcesMenu } activeMenu
 */
export function getSubnavigation(activeMenu) {
  /**
    @param { Omit<XGovSubNavigationItem, 'children'> & { children: XGovSubNavigationItem[] } } menu
   */
  return function (menu) {
    return {
      ...menu,
      children: menu.children.map((subMenu) => {
        if (subMenu.href === activeMenu) {
          return {
            ...subMenu,
            href: menu.href + subMenu.href,
            current: true
          }
        }
        return subMenu
      })
    }
  }
}

/**
 * @import { WebsiteLevel1Routes, Level2GetStartedMenu, Level2ResourcesMenu } from '~/src/routes/website/index.js'
 */
