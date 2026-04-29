import { randomUUID } from 'node:crypto'

import { getErrorMessage } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import { DateTime } from 'luxon'

import {
  getUserClaims,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { getUser } from '~/src/lib/manage.js'

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
    id: /** @type {string} */ (token.oid ?? token.sub),
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

  credentials.user = user

  try {
    const entitlementUser = await getUser(credentials.token, user.id)

    credentials.scope = entitlementUser.scopes
    user.roles = entitlementUser.roles

    logger.info('Successfully fetched roles from entitlement API')
  } catch (err) {
    if (
      Boom.isBoom(err) &&
      err.output.statusCode === StatusCodes.NOT_FOUND.valueOf()
    ) {
      logger.info(
        `User ${user.id} not found in entitlement service, no scopes assigned`
      )
      credentials.scope = []
    } else {
      logger.error(err, `Entitlement API failed: ${getErrorMessage(err)}`)
      throw err
    }
  }

  // Create and retrieve user session from Redis
  await server.methods.session.set(user.id, credentials)
  return server.methods.session.get(user.id)
}

/**
 * @import { AuthArtifacts, Request, UserCredentials } from '@hapi/hapi'
 * @import { AuthWithTokens } from '~/src/common/helpers/auth/types.js'
 */
