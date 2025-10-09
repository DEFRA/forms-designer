import {
  getSubmenuPaginatorMap,
  getSubnavigation,
  getWebsitePageNavigation
} from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

/**
 * @param {Level2GetStartedMenu} currentSubmenu
 */
export function websiteGetStartedModel(currentSubmenu) {
  const [submenuItem] = content.getStarted.menus
  const { text: titleText } =
    submenuItem.children.find(({ param }) => param === currentSubmenu) ?? {}

  return {
    pageTitle: `Defra Forms: ${titleText}`,
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.GET_STARTED),
    pageHeading: {
      text: `Defra Forms: ${titleText}`,
      size: 'large',
      description: ''
    },
    masthead: {
      heading: { text: `${titleText}` },
      caption: { text: 'Getting started guide' }
    },
    subNavigation: {
      items: content.getStarted.menus.map(
        getSubnavigation(WebsiteLevel1Routes.GET_STARTED, currentSubmenu)
      )
    },
    pagination: getSubmenuPaginatorMap(submenuItem).get(currentSubmenu)
  }
}

/**
 * @import { Level2GetStartedMenu } from '~/src/routes/website/constants.js'
 */
