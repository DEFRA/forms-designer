import Joi from 'joi'

import { hasAuthenticated } from '~/src/common/helpers/auth/get-user-session.js'
import { websiteAboutModel } from '~/src/models/website/about.js'
import { websiteFeaturesModel } from '~/src/models/website/features.js'
import { websiteServicesModel } from '~/src/models/website/services.js'
import { websiteSubmenuModel } from '~/src/models/website/shared.js'
import { websiteSupportModel } from '~/src/models/website/support.js'
import { websiteWhatsNewModel } from '~/src/models/website/whats-new.js'
import {
  Level2GetStartedMenu,
  Level2ResourcesMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

/**
 * @type {{ param: WebsiteLevel1Routes | string; text: string; active?: boolean }[]}
 */
export const pageNavigationBase = [
  {
    param: WebsiteLevel1Routes.SERVICES,
    text: 'Services'
  },
  {
    param: WebsiteLevel1Routes.ABOUT,
    text: 'About'
  },
  {
    param: WebsiteLevel1Routes.GET_STARTED,
    text: 'Get started'
  },
  {
    param: WebsiteLevel1Routes.FEATURES,
    text: 'Features'
  },
  {
    param: WebsiteLevel1Routes.RESOURCES,
    text: 'Resources'
  },
  {
    param: WebsiteLevel1Routes.SUPPORT,
    text: 'Support'
  }
]

const [_, ...pageNavigationGuestBase] = pageNavigationBase

export const pageNavigationGuest = [
  {
    param: '',
    text: 'Services'
  },
  ...pageNavigationGuestBase
]

export default /** @satisfies {ServerRoute[]} */ ([
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.SERVICES}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)

      if (isGuest) {
        return h.redirect('/')
      }

      const servicesModel = websiteServicesModel(isGuest)
      return h.view('website/index', servicesModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.WHATS_NEW}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const whatsNewModel = websiteWhatsNewModel(isGuest)
      return h.view('website/whats-new', whatsNewModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.ABOUT}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const aboutModel = websiteAboutModel(isGuest)
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
    path: `/${WebsiteLevel1Routes.GET_STARTED}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.GET_STARTED,
        Level2GetStartedMenu.GET_ACCESS,
        content.getStarted.menus,
        'Getting started guide',
        isGuest
      )
      return h.view('website/get-started/index', aboutModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.GET_STARTED}/{subMenu}`,
    handler(request, h) {
      const { params } = request
      const { subMenu } = params
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.GET_STARTED,
        subMenu,
        content.getStarted.menus,
        'Getting started guide',
        isGuest
      )
      return h.view(`website/get-started/${subMenu}`, aboutModel)
    },
    options: {
      auth: {
        mode: 'try'
      },
      validate: {
        params: Joi.object().keys({
          subMenu: Joi.string().valid(...Object.values(Level2GetStartedMenu))
        })
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.RESOURCES}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const resourceModel = websiteSubmenuModel(
        WebsiteLevel1Routes.RESOURCES,
        Level2ResourcesMenu.DOES_IT_NEED,
        content.resources.menus,
        'Good form design guide',
        isGuest
      )
      return h.view('website/resources/index', resourceModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.RESOURCES}/{subMenu}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const { params } = request
      const { subMenu } = params
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.RESOURCES,
        subMenu,
        content.resources.menus,
        'Good form design guide',
        isGuest
      )
      return h.view(`website/resources/${subMenu}`, aboutModel)
    },
    options: {
      auth: {
        mode: 'try'
      },
      validate: {
        params: Joi.object().keys({
          subMenu: Joi.string().valid(...Object.values(Level2ResourcesMenu))
        })
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.FEATURES}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const featuresModel = websiteFeaturesModel(isGuest)
      return h.view('website/features/index', featuresModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.SUPPORT}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const supportModel = websiteSupportModel(isGuest)
      return h.view('website/support', supportModel)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
])

/**
 * @import { ServerRoute, AuthArtifacts, ResponseToolkit, Request } from '@hapi/hapi'
 */
