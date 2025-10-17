import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

/**
 * @param {boolean} isGuest
 */
export function websiteServicesBase(isGuest) {
  const { home } = content

  return {
    isGuest,
    displayHomeNav: true,
    pageTitle: content.home.mastHead.heading,
    content: home,
    pageHeading: {
      text: content.home.mastHead.heading,
      size: 'large'
    },
    errorList: []
  }
}

/**
 * @param {boolean} isGuest
 */
export function websiteServicesModel(isGuest) {
  return {
    ...websiteServicesBase(isGuest),
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.SERVICES,
      isGuest
    )
  }
}

/**
 * @import { AuthCredentials, UserCredentials, AppCredentials} from '@hapi/hapi'
 * @import { EntitlementUser } from '@defra/forms-model'
 */
