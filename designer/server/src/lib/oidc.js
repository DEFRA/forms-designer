import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

/**
 * Fetch the Well-Known Configuration for the OpenID Connect (OIDC) provider
 */
export async function getWellKnownConfiguration() {
  const getJsonByType = /** @type {typeof getJson<OidcMetadata>} */ (getJson)

  const requestUrl = new URL(config.oidcWellKnownConfigurationUrl)

  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Get a token using the token endpoint from the Well-Known Configuration
 * See {@link https://learn.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#4-refresh-the-token|Azure}'s documentation.
 * @param {URLSearchParams} params
 */
export async function getToken(params) {
  const wellKnownConfiguration = await getWellKnownConfiguration()

  const requestUrl = new URL(wellKnownConfiguration.token_endpoint)

  const postJsonByType = /** @type {typeof postJson<AuthArtifacts>} */ (
    postJson
  )

  return postJsonByType(requestUrl, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    payload: params.toString()
  })
}

/**
 * @import { AuthArtifacts } from '@hapi/hapi'
 * @import { OidcMetadata } from 'oidc-client-ts'
 */
