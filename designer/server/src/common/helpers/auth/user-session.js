import { DateTime } from 'luxon'

import {
  getUserClaims,
  getUserScopes,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'

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
    id: token.sub,
    email: token.email ?? token.unique_name ?? '',
    displayName: displayName ?? '',
    issuedAt: DateTime.fromSeconds(token.iat).toUTC().toISO(),
    expiresAt: DateTime.fromSeconds(token.exp).toUTC().toISO()
  })
}

/**
 * @param {Request<{ AuthArtifactsExtra: AuthArtifacts }>} request
 * @param {AuthArtifacts} [artifacts] - Sign in response using refresh token
 */
export async function createUserSession(request, artifacts) {
  const { auth, server } = request
  const { credentials } = auth

  // Prefer refreshed artifacts
  artifacts ??= auth.artifacts

  // Update credentials using artifacts
  credentials.token = artifacts.access_token
  credentials.idToken = artifacts.id_token
  credentials.refreshToken = artifacts.refresh_token
  credentials.expiresIn = artifacts.expires_in

  if (!hasAuthenticated(credentials)) {
    throw new Error('Missing user authentication tokens')
  }

  const claims = getUserClaims(credentials)
  const user = createUser(credentials, claims)

  // Add user scopes to credentials
  credentials.scope = getUserScopes(credentials, claims)

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
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
