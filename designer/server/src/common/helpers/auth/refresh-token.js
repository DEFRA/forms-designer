import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import config from '~/src/config.js'

/**
 * @param {Request} request
 */
export async function refreshAccessToken(request) {
  const { auth, logger } = request

  const { azureClientId, azureClientSecret, oidcWellKnownConfigurationUrl } =
    config

  if (
    !azureClientId ||
    !azureClientSecret ||
    !oidcWellKnownConfigurationUrl ||
    !auth.credentials.refreshToken
  ) {
    throw Boom.unauthorized()
  }

  const params = new URLSearchParams()

  params.append('client_id', azureClientId)
  params.append('client_secret', azureClientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', auth.credentials.refreshToken)
  params.append(
    'scope',
    `api://${azureClientId}/forms.user openid profile email offline_access user.read`
  )

  logger.info('Azure OIDC access token expired, refreshing...')

  const oidc = await fetch(oidcWellKnownConfigurationUrl).then(
    (response) => /** @type {Promise<OidcMetadata>} */ (response.json())
  )

  return fetch(oidc.token_endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    body: params
  }).then(async (response) =>
    response.ok
      ? /** @type {Promise<SigninResponse>} */ (response.json())
      : await dropUserSession(request)
  )
}

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').OidcMetadata} OidcMetadata
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').SigninResponse} SigninResponse
 */
