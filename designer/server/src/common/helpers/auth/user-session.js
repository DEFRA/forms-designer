import { token } from '@hapi/jwt'
import { DateTime } from 'luxon'

import { createLogger } from '../logging/logger.js'

import * as scopes from '~/src/common/constants/scopes.js'
import {
  getUser,
  getUserClaims
} from '~/src/common/helpers/auth/get-user-session.js'

const logger = createLogger()

/**
 * @param {AuthCredentials | null} [credentials]
 */
export function createUser(credentials) {
  const claims = getUserClaims(credentials)

  if (!claims) {
    return
  }

  return /** @satisfies {UserCredentials} */ ({
    id: claims.sub,
    email: claims.email ?? '',
    displayName: claims.name ?? '',
    issuedAt: DateTime.fromSeconds(claims.iat).toUTC().toISO(),
    expiresAt: DateTime.fromSeconds(claims.exp).toUTC().toISO()
  })
}

/**
 * @param {Request} request
 */
export async function createUserSession(request) {
  const { auth, server } = request

  // Optionally create user object (e.g. signed in token but no session)
  const user = !getUser(auth.credentials)
    ? createUser(auth.credentials)
    : auth.credentials.user

  if (auth.artifacts.id_token && typeof auth.artifacts.id_token === 'string') {
    request.auth.credentials.scope = getScopesFromGroups(
      auth.artifacts.id_token
    )
  } else {
    // we might want read-only access in the future, so this isn't a show-stopping error
    // but we can't grant permissions now. Log the error but leave the app to redirect back
    // to the sign-in screen with an error.
    logger.warn(
      'id_token has not been returned by the oauth2 provider. Scopes cannot be granted.'
    )
  }

  // Create and retrieve user session from Redis
  if (user?.id) {
    await server.methods.session.set(user.id, { ...auth.credentials, user })
    return server.methods.session.get(user.id)
  }
}

/**
 * Returns the scopes assigned to a user, given their profile with a group assigned.
 * @param {string} idToken - ID token containing the groups in the payload
 * @returns {Array<string>} - array of scopes assigned to the user
 */
function getScopesFromGroups(idToken) {
  const { decoded } = /** @type {UserToken<UserProfile>} */ (
    token.decode(idToken)
  )

  const userGroups = decoded.payload?.groups

  if (!userGroups || !Array.isArray(userGroups)) {
    logger.error('id_token.groups is missing or not an array')
    return []
  }

  let assignedScopes = /** @type {Set<string>} */ (new Set())

  for (const group of userGroups) {
    const scopesToAssign = scopes.groupsToScopes[group]

    if (scopesToAssign.length > 0) {
      assignedScopes = new Set([...assignedScopes, ...scopesToAssign])
    }
  }

  return Array.from(assignedScopes)
}

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').UserProfile} UserProfile
 */

/**
 * @template {object} Payload
 * @typedef {import('@hapi/jwt').HapiJwt.Artifacts<{ JwtPayload?: Payload }>} UserToken
 */
