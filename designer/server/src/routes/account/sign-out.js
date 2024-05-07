import { URL } from 'node:url'

import Boom from '@hapi/boom'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import config from '~/src/config.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/sign-out',
  async handler(request, h) {
    await dropUserSession(request)

    // Skip OpenID Connect (OIDC) in tests
    if (config.isTest) {
      return h.redirect('/')
    }

    // Otherwise require OpenID Connect (OIDC) configuration
    if (!config.azureClientId || !config.oidcWellKnownConfigurationUrl) {
      return Boom.unauthorized()
    }

    const oidc = await fetch(config.oidcWellKnownConfigurationUrl).then(
      (response) => /** @type {Promise<OidcMetadata>} */ (response.json())
    )

    // Build end session URL
    const endSessionUrl = new URL(oidc.end_session_endpoint)
    endSessionUrl.searchParams.set('client_id', config.azureClientId)

    // Redirect to end session URL
    return h.redirect(endSessionUrl.href)
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
})

/**
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').OidcMetadata} OidcMetadata
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
