import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

/**
 * @param {boolean} isGuest
 */
export function websiteFeaturesModel(isGuest) {
  return {
    isGuest,
    pageTitle: 'Defra Forms: Features',
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.FEATURES,
      isGuest
    ),
    pageHeading: {
      text: 'Features',
      description: 'large'
    },
    features: content.features
  }
}
