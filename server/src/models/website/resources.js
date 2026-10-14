import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isGuest
 */
export function websiteResourcesModel(isGuest) {
  return {
    isGuest,
    pageTitle: 'Defra Forms: Resources',
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.RESOURCES,
      isGuest
    ),
    pageHeading: {
      text: 'Resources',
      description: 'large'
    }
  }
}
