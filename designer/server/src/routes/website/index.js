import { websiteAboutModel } from '~/src/models/website/about.js'

/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
export const WebsiteLevel1Routes = {
  HOME: '/',
  ABOUT: '/about',
  GET_STARTED: '/get-started',
  FEATURES: '/features',
  RESOURCES: '/resources',
  SUPPORT: '/support'
}

export const pageNavigationBase = [
  {
    href: WebsiteLevel1Routes.ABOUT,
    text: 'About'
  },
  {
    href: WebsiteLevel1Routes.GET_STARTED,
    text: 'Get started'
  },
  {
    href: WebsiteLevel1Routes.FEATURES,
    text: 'Features'
  },
  {
    href: WebsiteLevel1Routes.RESOURCES,
    text: 'Resources'
  },
  {
    href: WebsiteLevel1Routes.SUPPORT,
    text: 'Support'
  }
]

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: WebsiteLevel1Routes.ABOUT,
  handler(request, h) {
    const aboutModel = websiteAboutModel()
    return h.view('website/about', aboutModel)
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
