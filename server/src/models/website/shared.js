import {
  getSubmenuPaginatorMap,
  getSubnavigation,
  getWebsitePageNavigation
} from '~/src/models/website/helpers.js'

/**
 *
 * @param { WebsiteLevel1Routes } level1Menu
 * @param { Level2MakingAFormMenu } level2Menu
 * @param { XGovContentSubNavigationItemWithChildren } contentMenus
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
  const { text: titleText } =
    contentMenus.children.find(({ param }) => param === level2Menu) ?? {}

  return {
    isGuest,
    pageTitle: `Defra Forms: ${titleText}`,
    pageNavigation: getWebsitePageNavigation(level1Menu, isGuest),
    pageHeading: {
      text: `Defra Forms: ${titleText}`,
      size: 'large',
      description: ''
    },
    masthead: {
      heading: { text: titleText },
      caption: { text: caption }
    },
    subNavigation: {
      items: contentMenus.children.map(getSubnavigation(level1Menu, level2Menu))
    },
    pagination: getSubmenuPaginatorMap(contentMenus).get(level2Menu)
  }
}

/**
 * @import { WebsiteLevel1Routes, Level2MakingAFormMenu } from '~/src/routes/website/constants.js'
 * @import { XGovContentSubNavigationItemWithChildren } from '~/src/models/website/helpers.js'
 */
