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
