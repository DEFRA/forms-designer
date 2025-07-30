import config from '~/src/config.js'

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
 */
export function accountViewModel(credentials) {
  const pageTitle = 'My account'

  const navigation = [
    {
      text: 'My account',
      Url: '/account',
      isActive: true
    }
  ]

  // if (hasAdmin(credentials)) {
  navigation.push({
    text: 'Manage users',
    Url: '/manage/users',
    isActive: false
  })
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
            text: credentials.user?.email
          }
        },
        {
          key: {
            text: 'Role'
          },
          value: {
            text: credentials.user?.email
          }
        }
      ]
    }
  }
}

/**
 * @import { AuthCredentials, UserCredentials, AppCredentials} from '@hapi/hapi'
 */
