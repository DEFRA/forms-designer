import {
  getSubnavigation,
  getWebsitePageNavigation
} from '~/src/models/website/helpers.js'
import content from '~/src/routes/website/content.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/index.js'

/**
 * @param {Level2GetStartedMenu} currentSubmenu
 */
export function websiteGetStartedModel(currentSubmenu) {
  return {
    pageTitle: 'Defra Forms: Get access to the Defra Form Designer ',
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.GET_STARTED),
    pageHeading: {
      text: 'Defra Forms: Get access to the Defra Form Designer',
      size: 'large',
      description: ''
    },
    masthead: {
      heading: { text: 'Get access to the Defra Form Designer' },
      caption: { text: 'Getting started guide' }
    },
    subNavigation: {
      items: content.getStarted.menus.map(getSubnavigation(currentSubmenu))
    },
    pagination: {
      next: {
        labelText: 'Make a form live checklist',
        href: WebsiteLevel1Routes.GET_STARTED + currentSubmenu
      }
    }
  }
}

/**
 * @import { Level2GetStartedMenu } from '~/src/routes/website/index.js'
 */
