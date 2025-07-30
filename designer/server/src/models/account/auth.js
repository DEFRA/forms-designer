import config from '~/src/config.js'
import { roleNameMapper } from '~/src/models/account/role-mapper.js'

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

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    errorList
  }
}

/**
 * @param { AuthCredentials<UserCredentials, AppCredentials> & Record<string, unknown> } credentials
 * @param {EntitlementUser} user
 */
export function accountViewModel(credentials, user) {
  const pageTitle = 'My account'

  const navigation = [
    {
      text: 'My account',
      url: '/auth/account',
      isActive: true
    }
  ]

  // TODO - determine hwot ochec if user has ADMIN role
  // if (hasAdmin(credentials)) {
  // navigation.push({
  //   text: 'Manage users',
  //   url: '/manage/users',
  //   isActive: false
  // })
  // }

  return {
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    pageCaption: {
      text: credentials.user?.displayName
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
            text: user.roles.map(roleNameMapper).join(', ')
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
