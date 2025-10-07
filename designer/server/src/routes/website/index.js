import { websiteAboutModel } from '~/src/models/website/about.js'
import { websiteGetStartedModel } from '~/src/models/website/get-started.js'

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

/**
 * Enum for get started menus.
 * @readonly
 * @enum {string}
 */
export const Level2GetStartedMenu = {
  GET_ACCESS: '/get-access',
  MAKE_FORM_LIVE: '/make-form-live-checklist',
  FORM_SUITABILITY: '/form-suitability-criteria',
  MEASURING_SUCCESS: '/measuring-suitability'
}
/**
 * Enum for get Resources menus.
 * @readonly
 * @enum {string}
 */
export const Level2ResourcesMenu = {
  DOES_IT_NEED: '/does-this-need-to-be-a-form',
  ACCESSIBILITY: '/accessibility-and-inclusion',
  SMES: '/working-with-subject-matter-experts',
  QUESTION_PROTOCOLS: '/question-protocols',
  PROTOTYPING: '/prototyping-a-form',
  FORM_PAGES_GOVUK: '/form-pages-on-govuk',
  PEER_REVIEWING: '/peer-reviewing-forms',
  PRIVACY_NOTICES: '/privacy-notices'
}
/**
 * @type {{ href: WebsiteLevel1Routes | string; text: string; active?: boolean }[]}
 */
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

export default /** @satisfies {ServerRoute[]} */ ([
  {
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
  },
  {
    method: 'GET',
    path: WebsiteLevel1Routes.GET_STARTED,
    handler(request, h) {
      const aboutModel = websiteGetStartedModel(Level2GetStartedMenu.GET_ACCESS)
      return h.view('website/get-started/index', aboutModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
])

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
