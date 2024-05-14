import { DateTime } from 'luxon'

import {
  getUserClaims,
  hasUser,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'

/**
 * @param {AuthWithTokens} credentials
 */
export function createUser(credentials) {
  if (hasUser(credentials)) {
    return credentials.user
  }

  const claims = getUserClaims(credentials)

  const {
    name, // Lastname, firstname
    given_name: firstName,
    family_name: lastName
  } = claims

  // Improve display name formatting
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : name

  // Create user object (e.g. signed in token but no session)
  return /** @satisfies {UserCredentials} */ ({
    id: claims.sub,
    email: claims.email ?? '',
    displayName: displayName ?? '',
    issuedAt: DateTime.fromSeconds(claims.iat).toUTC().toISO(),
    expiresAt: DateTime.fromSeconds(claims.exp).toUTC().toISO()
  })
}

/**
 * @param {Request<{ AuthArtifactsExtra: AuthArtifacts }>} request
 */
export async function createUserSession(request) {
  const { auth, server } = request
  const { artifacts, credentials } = auth

  // Patch missing properties using Bell artifacts
  credentials.idToken = artifacts.id_token

  if (!hasAuthenticated(credentials)) {
    throw new Error('Missing user authentication tokens')
  }

  const user = createUser(credentials)

  // Create and retrieve user session from Redis
  await server.methods.session.set(user.id, { ...credentials, user })
  return server.methods.session.get(user.id)
}

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 * @typedef {import('~/src/common/helpers/auth/get-user-session.js').AuthWithTokens} AuthWithTokens
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */
