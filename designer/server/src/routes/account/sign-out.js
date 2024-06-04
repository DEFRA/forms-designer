import { URL } from 'node:url'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'

const redirectUrl = new URL(`/account/signed-out`, config.appBaseUrl)

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/sign-out',
  async handler(request, h) {
    const { credentials } = request.auth

    // Skip OpenID Connect (OIDC) when not authenticated
    if (!hasUser(credentials) || config.isTest) {
      await dropUserSession(request)
      return h.redirect('/')
    }

    const oidc = await fetch(config.oidcWellKnownConfigurationUrl).then(
      (response) => /** @type {Promise<OidcMetadata>} */ (response.json())
    )

    // Build end session URL
    const endSessionUrl = new URL(oidc.end_session_endpoint)
    endSessionUrl.searchParams.set('client_id', config.azureClientId)
    endSessionUrl.searchParams.set('id_token_hint', credentials.idToken)
    endSessionUrl.searchParams.set('post_logout_redirect_uri', redirectUrl.href)

    await dropUserSession(request)

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
