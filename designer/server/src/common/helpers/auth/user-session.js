import { DateTime } from 'luxon'

import {
  getUser,
  getUserClaims
} from '~/src/common/helpers/auth/get-user-session.js'

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
 * @param {Request<{ AuthArtifactsExtra: AuthArtifacts }>} request
 */
export async function createUserSession(request) {
  const { auth, server } = request

  // Optionally create user object (e.g. signed in token but no session)
  const user = !getUser(auth.credentials)
    ? createUser(auth.credentials)
    : auth.credentials.user

  // Create and retrieve user session from Redis
  if (user?.id) {
    await server.methods.session.set(user.id, { ...auth.credentials, user })
    return server.methods.session.get(user.id)
  }
}

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */
