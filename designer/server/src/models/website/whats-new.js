import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import content from '~/src/routes/website/content.js'

/**
 * @param {boolean} isGuest
 */
export function websiteWhatsNewModel(isGuest) {
  const mastHead = content.whatsNew.mastHead
  return {
    isGuest,
    pageTitle: `Defra Forms: ${mastHead.heading}`,
    pageNavigation: getWebsitePageNavigation(undefined, isGuest),
    masthead: {
      heading: { text: mastHead.heading },
      caption: { text: mastHead.caption },
      description: {
        text: mastHead.description
      }
    },
    pageHeading: {
      text: mastHead.heading,
      description: 'large'
    },
    latest: content.whatsNew.latest
  }
}
