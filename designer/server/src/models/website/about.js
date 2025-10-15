import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isGuest
 */
export function websiteAboutModel(isGuest) {
  return {
    isGuest,
    pageTitle: 'Defra Forms: About the Defra Forms team',
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.ABOUT,
      isGuest
    ),
    pageHeading: {
      text: 'About the Defra Forms team',
      description: 'large'
    }
  }
}
