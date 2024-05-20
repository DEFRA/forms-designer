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

export function signInViewModel() {
  const pageTitle = `Sign in to ${config.serviceName}`

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').RequestAuth} RequestAuth
 */
