import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isLoggedIn
 */
export function websiteAboutModel(isLoggedIn) {
  return {
    isLoggedIn,
    pageTitle: 'Defra Forms: About the Defra Forms team',
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.ABOUT),
    pageHeading: {
      text: 'About the Defra Forms team',
      description: 'large'
    }
  }
}
