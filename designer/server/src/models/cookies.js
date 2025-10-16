import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isGuest
 */
export function websiteCookiesModel(isGuest) {
  return {
    isGuest,
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.SERVICES,
      isGuest
    )
  }
}
