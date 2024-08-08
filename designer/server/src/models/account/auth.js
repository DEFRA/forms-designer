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
