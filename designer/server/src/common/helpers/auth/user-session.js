import { randomUUID } from 'node:crypto'

import { getErrorMessage, mapScopesToRoles } from '@defra/forms-model'
import { DateTime } from 'luxon'

import {
  getUserClaims,
  getUserScopes,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { getUser } from '~/src/lib/manage.js'

const logger = createLogger()

/**
 * @param {AuthWithTokens} credentials
 * @param {ReturnType<typeof getUserClaims>} [claims]
 */
export function createUser(credentials, claims) {
  const { token } = claims ?? getUserClaims(credentials)

  const {
    name, // Lastname, firstname
    given_name: firstName,
    family_name: lastName
  } = token

  // Improve display name formatting
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : name

  // Create user object (e.g. signed in token but no session)
  return /** @satisfies {UserCredentials} */ ({
    id: /** @type {string} */ (
      config.featureFlagUseEntitlementApi ? (token.oid ?? token.sub) : token.sub
    ),
    email: token.email ?? token.unique_name ?? '',
    displayName: displayName ?? '',
    issuedAt: DateTime.fromSeconds(token.iat).toUTC().toISO(),
    expiresAt: DateTime.fromSeconds(token.exp).toUTC().toISO(),
    roles: /** @type {string[]} */ ([])
  })
}

/**
 * @param {Request<{ AuthArtifactsExtra: AuthArtifacts }>} request
 * @param {AuthArtifacts} [artifacts] - Sign in response using refresh token
 * @param {string} [flowIdOverride] - Reuse an existing flowId
 */
export async function createUserSession(request, artifacts, flowIdOverride) {
  const { auth, server } = request
  const { credentials } = auth

  // Prefer refreshed artifacts
  artifacts ??= auth.artifacts

  // Update credentials using artifacts
  credentials.token = artifacts.access_token
  credentials.idToken = artifacts.id_token
  credentials.refreshToken = artifacts.refresh_token
  credentials.expiresIn = artifacts.expires_in
  credentials.flowId = flowIdOverride ?? randomUUID() // a unique ID for the current session

  if (!hasAuthenticated(credentials)) {
    throw new Error('Missing user authentication tokens')
  }

  const claims = getUserClaims(credentials)
  const user = createUser(credentials, claims)

  if (config.featureFlagUseEntitlementApi) {
    try {
      const entitlementUser = await getUser(credentials.token, user.id)
      user.roles = entitlementUser.roles

      credentials.scope =
        user.roles.length > 0
          ? mapScopesToRoles(/** @type {Roles[]} */ (user.roles))
          : []

      logger.info('Successfully fetched roles from entitlement API')
    } catch (error) {
      logger.error(
        error,
        `Entitlement API failed, falling back to AAD groups: ${getErrorMessage(error)}`
      )

      user.roles = []
      credentials.scope = getUserScopes(credentials, claims)
    }
  } else {
    credentials.scope = getUserScopes(credentials, claims)
    user.roles = []
  }

  // Create and retrieve user session from Redis
  await server.methods.session.set(user.id, { ...credentials, user })
  return server.methods.session.get(user.id)
}

/**
 * @import { AuthArtifacts, Request, UserCredentials } from '@hapi/hapi'
 * @import { Roles } from '@defra/forms-model'
 * @import { AuthWithTokens } from '~/src/common/helpers/auth/types.js'
 */
