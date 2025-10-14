import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isGuest
 */
export function websiteSupportModel(isGuest) {
  const title = 'Support'
  return {
    isGuest,
    pageTitle: `Defra Forms: ${title}`,
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.SUPPORT),
    pageHeading: {
      text: title,
      description: 'large'
    }
  }
}
