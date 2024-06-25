import Boom from '@hapi/boom'
import Wreck from '@hapi/wreck'

import { scope } from '~/src/common/helpers/auth/azure-oidc.js'
import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { hasAuthenticated } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'

/**
 * @param {Request | Request<{ AuthArtifactsExtra: AuthArtifacts }>} request
 */
export async function refreshAccessToken(request) {
  const { auth } = request
  const { credentials } = auth

  const { azureClientId, azureClientSecret, oidcWellKnownConfigurationUrl } =
    config

  if (
    !azureClientId ||
    !azureClientSecret ||
    !oidcWellKnownConfigurationUrl ||
    !hasAuthenticated(credentials)
  ) {
    throw Boom.unauthorized()
  }

  const params = new URLSearchParams()

  params.append('client_id', azureClientId)
  params.append('client_secret', azureClientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', credentials.refreshToken)
  params.append('scope', scope.join(' '))

  const oidc = await Wreck.get(config.oidcWellKnownConfigurationUrl, {
    json: true
  }).then((response) => /** @type {OidcMetadata} */ (response.payload))

  const response = await Wreck.post(oidc.token_endpoint, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    payload: params
  })

  if (!response.res.statusCode) {
    await dropUserSession(request)
    throw Boom.unauthorized()
  }

  const artifacts = await /** @type {Promise<AuthArtifacts>} */ (
    response.payload
  )

  return artifacts
}

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').OidcMetadata} OidcMetadata
 */
