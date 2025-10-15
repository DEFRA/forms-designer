import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { getNameForRole } from '~/src/models/account/role-mapper.js'
import content from '~/src/routes/website/content.js'
import { pageNavigationBase } from '~/src/routes/website/index.js'

/**
 * @param {boolean} isGuest
 */
export function servicesViewModel(isGuest) {
  const { home } = content

  return {
    isGuest,
    pageTitle,
    content: home,
    pageNavigation: pageNavigationBase.map(({ param, ...m }) => ({
      ...m,
      href: `/${param}`
    })),
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    errorList: []
  }
}

/**
 * @import { AuthCredentials, UserCredentials, AppCredentials} from '@hapi/hapi'
 * @import { EntitlementUser } from '@defra/forms-model'
 */
