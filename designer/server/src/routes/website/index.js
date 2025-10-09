import Joi from 'joi'

import { websiteAboutModel } from '~/src/models/website/about.js'
import { websiteSubmenuModel } from '~/src/models/website/shared.js'
import { websiteSupportModel } from '~/src/models/website/support.js'
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

export default /** @satisfies {ServerRoute[]} */ ([
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.ABOUT}`,
    handler(_request, h) {
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
    path: `/${WebsiteLevel1Routes.GET_STARTED}`,
    handler(_request, h) {
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.GET_STARTED,
        Level2GetStartedMenu.GET_ACCESS,
        content.getStarted.menus,
        'Getting started guide'
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
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.GET_STARTED,
        subMenu,
        content.getStarted.menus,
        'Getting started guide'
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
    handler(_request, h) {
      const resourceModel = websiteSubmenuModel(
        WebsiteLevel1Routes.RESOURCES,
        Level2ResourcesMenu.DOES_IT_NEED,
        content.resources.menus,
        'Good form design guide'
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
      const { params } = request
      const { subMenu } = params
      const aboutModel = websiteSubmenuModel(
        WebsiteLevel1Routes.RESOURCES,
        subMenu,
        content.resources.menus,
        'Good form design guide'
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
    path: `/${WebsiteLevel1Routes.SUPPORT}`,
    handler(_request, h) {
      const supportModel = websiteSupportModel()
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
 * @import { ServerRoute } from '@hapi/hapi'
 */
