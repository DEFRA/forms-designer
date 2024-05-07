import config from '~/src/config.js'

export function signedOutViewModel() {
  return {
    pageTitle: 'You have signed out'
  }
}

/**
 *  @param {boolean} userFailedAuthorisation - indicates the user has failed authorisation, but authentication was successful
 */
export function signInViewModel(userFailedAuthorisation) {
  return {
    pageTitle: `Sign in to ${config.serviceName}`,
    userFailedAuthorisation
  }
}
