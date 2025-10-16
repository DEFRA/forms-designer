import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { getNameForRole } from '~/src/models/account/role-mapper.js'
import { getWebsitePageNavigation } from '~/src/models/website/helpers.js'
import { websiteServicesBase } from '~/src/models/website/services.js'
import content from '~/src/routes/website/content.js'

export function signedOutViewModel() {
  const pageTitle = 'You have signed out'

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    }
  }
}

/**
 * @param {{ hasFailedAuthorisation?: boolean }} [options]
 */
export function signInViewModel(options) {
  const pageTitle = `Sign in to ${config.serviceName}`
  const errorList = []

  if (options?.hasFailedAuthorisation) {
    errorList.push({
      html: `We could not sign you in. Please contact the system administrator for help,
      <a href="mailto:steven.thomas@defra.gov.uk" class="govuk-link">steven.thomas@defra.gov.uk</a>`
    })
  }

  const { home } = content

  return {
    ...websiteServicesBase(true),
    pageNavigation: getWebsitePageNavigation('', true),
    pageTitle,
    content: home,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    errorList
  }
}

/**
 * @param {EntitlementUser} user
 */
export function accountViewModel(user) {
  const pageTitle = 'My account'

  const navigation = [
    {
      text: 'My account',
      url: '/auth/account',
      isActive: true
    }
  ]

  if (hasAdminRole(user)) {
    navigation.push({
      text: 'Manage users',
      url: '/manage/users',
      isActive: false
    })
  }

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    pageCaption: {
      text: user.displayName
    },
    backLink: {
      text: 'Back to form library',
      href: '/library'
    },
    userDetails: {
      rows: [
        {
          key: {
            text: 'Email'
          },
          value: {
            text: user.email
          }
        },
        {
          key: {
            text: 'Role'
          },
          value: {
            text: user.roles.map(getNameForRole).join(', ')
          }
        }
      ]
    },
    user
  }
}

/**
 * @import { AuthCredentials, UserCredentials, AppCredentials} from '@hapi/hapi'
 * @import { EntitlementUser } from '@defra/forms-model'
 */
