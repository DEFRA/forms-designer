import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

export function websiteSupportModel() {
  const title = 'Support'
  return {
    pageTitle: `Defra Forms: ${title}`,
    pageNavigation: getWebsitePageNavigation(WebsiteLevel1Routes.SUPPORT),
    pageHeading: {
      text: title,
      description: 'large'
    }
  }
}
