/**
 *  @param {boolean} [userFailedAuthorisation] - indicates the user has failed authorisation, but authentication was successful
 */
export function signedOutViewModel(userFailedAuthorisation) {
  return {
    pageTitle: 'You have signed out',
    userFailedAuthorisation
  }
}
