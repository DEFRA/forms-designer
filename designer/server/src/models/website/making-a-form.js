import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { WebsiteLevel1Routes } from '~/src/routes/website/constants.js'

/**
 * @param {boolean} isGuest
 */
export function websiteMakingAFormModel(isGuest) {
  return {
    isGuest,
    pageTitle: 'Defra Forms: Making a form',
    pageNavigation: getWebsitePageNavigation(
      WebsiteLevel1Routes.MAKING_A_FORM,
      isGuest
    ),
    pageHeading: {
      text: 'Making a form',
      description: 'large'
    }
  }
}
