import Joi from 'joi'

import { websiteAboutModel } from '~/src/models/website/about.js'
import { websiteGetStartedModel } from '~/src/models/website/get-started.js'
import {
  Level2GetStartedMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'

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
    path: `/${WebsiteLevel1Routes.GET_STARTED}`,
    handler(request, h) {
      const aboutModel = websiteGetStartedModel(Level2GetStartedMenu.GET_ACCESS)
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
      const aboutModel = websiteGetStartedModel(subMenu)
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
  }
])

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
