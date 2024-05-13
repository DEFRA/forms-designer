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
  const errorList = []

  if (userFailedAuthorisation) {
    errorList.push({
      html: `We couldn’t sign you in. Please contact the system administrator for help,
      <a href="mailto:steven.thomas@defra.gov.uk" class="govuk-link">steven.thomas@defra.gov.uk</a>`
    })
  }

  return {
    pageTitle: `Sign in to ${config.serviceName}`,
    errorList
  }
}
