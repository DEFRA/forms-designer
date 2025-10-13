import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isLoggedIn
 */
export function websiteSupportModel(isLoggedIn) {
  const title = 'Support'
  return {
    isLoggedIn,
    pageTitle: `Defra Forms: ${title}`,
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.SUPPORT),
    pageHeading: {
      text: title,
      description: 'large'
    }
  }
}
