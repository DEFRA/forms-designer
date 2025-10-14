import {
  getSubmenuPaginatorMap,
  getSubnavigation,
  getWebsitePageNavigation
} from '~/src/models/website/helpers.js'

/**
 *
 * @param { WebsiteLevel1Routes } level1Menu
 * @param { Level2GetStartedMenu | Level2ResourcesMenu } level2Menu
 * @param { (Omit<XGovContentSubNavigationItem, 'children'> & { children: XGovContentSubNavigationItem[] })[] } contentMenus
 * @param { string } caption
 * @param {boolean} isGuest
 */
export function websiteSubmenuModel(
  level1Menu,
  level2Menu,
  contentMenus,
  caption,
  isGuest
) {
  const [subMenuParent] = contentMenus
  const { text: titleText } =
    subMenuParent.children.find(({ param }) => param === level2Menu) ?? {}

  return {
    isGuest,
    pageTitle: `Defra Forms: ${titleText}`,
    pageNavigation: getWebsitePageNavigation(level1Menu),
    pageHeading: {
      text: `Defra Forms: ${titleText}`,
      size: 'large',
      description: ''
    },
    masthead: {
      heading: { text: `${titleText}` },
      caption: { text: caption }
    },
    subNavigation: {
      items: contentMenus.map(getSubnavigation(level1Menu, level2Menu))
    },
    pagination: getSubmenuPaginatorMap(subMenuParent).get(level2Menu)
  }
}

/**
 * @import { WebsiteLevel1Routes, Level2ResourcesMenu, Level2GetStartedMenu } from '~/src/routes/website/constants.js'
 * @import { XGovContentSubNavigationItem } from '~/src/models/website/helpers.js'
 */
