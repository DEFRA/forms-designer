import Joi from 'joi'

import { hasAuthenticated } from '~/src/common/helpers/auth/get-user-session.js'
import { websiteFeaturesModel } from '~/src/models/website/features.js'
import { websiteSubmenuModel } from '~/src/models/website/shared.js'
import { websiteSupportModel } from '~/src/models/website/support.js'
import {
  Level2MakingAFormMenu,
  Level2ResourcesMenu,
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

// const [_, ...pageNavigationGuestBase] = pageNavigationBase

// export const pageNavigationGuest = [
//   {
//     param: '',
//     text: 'Services'
//   },
//   ...pageNavigationGuestBase
// ]

export const pageNavigationGuest = pageNavigationBase

export default /** @satisfies {ServerRoute[]} */ ([
  // {
  //   method: 'GET',
  //   path: `/${WebsiteLevel1Routes.SERVICES}`,
  //   handler(request, h) {
  //     const isGuest = !hasAuthenticated(request.auth.credentials)

  //     if (isGuest) {
  //       return h.redirect('/')
  //     }

  //     const servicesModel = websiteServicesModel(isGuest)
  //     return h.view('website/index', servicesModel)
  //   },
  //   options: {
  //     auth: {
  //       mode: 'try'
  //     }
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: `/${WebsiteLevel1Routes.WHATS_NEW}`,
  //   handler(request, h) {
  //     const isGuest = !hasAuthenticated(request.auth.credentials)
  //     const whatsNewModel = websiteWhatsNewModel(isGuest)
  //     return h.view('website/whats-new', whatsNewModel)
  //   },
  //   options: {
  //     auth: {
  //       mode: 'try'
  //     }
  //   }
  // },

  // {
  //   method: 'GET',
  //   path: `/${WebsiteLevel1Routes.MAKING_A_FORM}`,
  //   handler(request, h) {
  //     const isGuest = !hasAuthenticated(request.auth.credentials)
  //     const makingAFormModel = websiteMakingAFormModel(isGuest)
  //     return h.view('website/making-a-form', makingAFormModel)
  //   },
  //   options: {
  //     auth: {
  //       mode: 'try'
  //     }
  //   }
  // },
  {
    method: 'GET',
    path: `/${WebsiteLevel1Routes.MAKING_A_FORM}/{subMenu?}`,
    handler(request, h) {
      const { params } = request
      const { subMenu = 'index' } = params
      const isGuest = !hasAuthenticated(request.auth.credentials)
      const model = websiteSubmenuModel(
        WebsiteLevel1Routes.MAKING_A_FORM,
        subMenu,
        content.makingAForm.menus,
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
  // {
  //   method: 'GET',
  //   path: `/${WebsiteLevel1Routes.GET_STARTED}`,
  //   handler(request, h) {
  //     const isGuest = !hasAuthenticated(request.auth.credentials)
  //     const aboutModel = websiteSubmenuModel(
  //       WebsiteLevel1Routes.GET_STARTED,
  //       Level2GetStartedMenu.GET_ACCESS,
  //       content.getStarted.menus,
  //       'Getting started guide',
  //       isGuest
  //     )
  //     return h.view('website/get-started/index', aboutModel)
  //   },
  //   options: {
  //     auth: {
  //       mode: 'try'
  //     }
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: `/${WebsiteLevel1Routes.GET_STARTED}/{subMenu}`,
  //   handler(request, h) {
  //     const { params } = request
  //     const { subMenu } = params
  //     const isGuest = !hasAuthenticated(request.auth.credentials)
  //     const aboutModel = websiteSubmenuModel(
  //       WebsiteLevel1Routes.GET_STARTED,
  //       subMenu,
  //       content.getStarted.menus,
  //       'Getting started guide',
  //       isGuest
  //     )
  //     return h.view(`website/get-started/${subMenu}`, aboutModel)
  //   },
  //   options: {
  //     auth: {
  //       mode: 'try'
  //     },
  //     validate: {
  //       params: Joi.object().keys({
  //         subMenu: Joi.string().valid(...Object.values(Level2GetStartedMenu))
  //       })
  //     }
  //   }
  // },
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
