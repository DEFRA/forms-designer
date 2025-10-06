import {
  WebsiteLevel1Routes,
  pageNavigationBase
} from '~/src/routes/website/index.js'

export function websiteAboutModel() {
  const pageNavigation = pageNavigationBase.map((item) => {
    if (item.href === WebsiteLevel1Routes.ABOUT) {
      return {
        ...item,
        active: true
      }
    }
    return item
  })
  return {
    pageTitle: 'Defra Forms: About the Defra Forms team',
    pageNavigation,
    pageHeading: {
      text: 'Defra Forms: About the Defra Forms team',
      size: 'large'
    }
  }
}
