import Joi from 'joi'

import { hasAuthenticated } from '~/src/common/helpers/auth/get-user-session.js'
import { websiteFeaturesModel } from '~/src/models/website/features.js'
import { websiteMakingAFormModel } from '~/src/models/website/making-a-form.js'
import { websiteResourcesModel } from '~/src/models/website/resources.js'
import { websiteSubmenuModel } from '~/src/models/website/shared.js'
import { websiteSupportModel } from '~/src/models/website/support.js'
import {
  Level2MakingAFormMenu,
  WebsiteLevel1Routes
} from '~/src/routes/website/constants.js'
import content from '~/src/routes/website/content.js'

/**
 * @type {{ param: WebsiteLevel1Routes | string; text: string; active?: boolean }[]}
 */
export const pageNavigationBase = [
  {
    param: WebsiteLevel1Routes.HOME,
    text: 'Home'
  },
  {
    param: WebsiteLevel1Routes.FEATURES,
    text: 'Features'
  },
  {
    param: WebsiteLevel1Routes.MAKING_A_FORM,
    text: 'Making a form'
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

export const pageNavigationGuest = pageNavigationBase.filter(
  (nav) => nav.param !== WebsiteLevel1Routes.RESOURCES
)

export default /** @satisfies {ServerRoute[]} */ ([
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.MAKING_A_FORM}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const model = websiteMakingAFormModel(isGuest)
      return h.view(`website/making-a-form/index`, model)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.MAKING_A_FORM}/{subMenu}`,
    handler(request, h) {
      const { params } = request
      const { subMenu } = params
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const contentMenus = /** @type {XGovContentSubNavigationItemWithChildren} */
        (content.makingAForm.menus.find(menu => menu.children.find((c) => c.param === subMenu)))

      const model = websiteSubmenuModel(
        WebsiteLevel1Routes.MAKING_A_FORM,
        subMenu,
        contentMenus,
        'Making a form',
        isGuest
      )
      return h.view(`website/making-a-form/${subMenu}`, model)
    },
    options: {
      auth: {
        mode: 'try'
      },
      validate: {
        params: Joi.object().keys({
          subMenu: Joi.string().valid(...Object.values(Level2MakingAFormMenu))
        })
      }
    }
  },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.RESOURCES}`,
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const resourceModel = websiteResourcesModel(isGuest)
      return h.view('website/resources/index', resourceModel)
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
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { XGovContentSubNavigationItemWithChildren } from '~/src/models/website/helpers.js'
 */
