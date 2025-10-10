import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

export function websiteFeaturesModel() {
  return {
    pageTitle: 'Defra Forms: Features',
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.FEATURES),
    pageHeading: {
      text: 'Features',
      description: 'large'
    },
    features: content.features
  }
}
