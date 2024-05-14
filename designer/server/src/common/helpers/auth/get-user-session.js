import { token } from '@hapi/jwt'

/**
 * @param {Request} request
 * @param {{ sessionId: string, user: UserCredentials }} [session] - Session cookie state
 */
export async function getUserSession(request, session) {
  const { auth, server } = request

  // Check for existing user
  if (getUser(auth.credentials)) {
    return auth.credentials
  }

  // Prefer Session ID from cookie state
  let sessionId = session?.sessionId

  // Fall back to OpenID Connect (OIDC) claim
  if (!sessionId) {
    const claims = getUserClaims(auth.credentials)

    if (claims?.sub) {
      sessionId = claims.sub
    }
  }

  // Retrieve user session from Redis
  if (sessionId) {
    return server.methods.session.get(sessionId)
  }
}

/**
 * @param {AuthCredentials | null} [credentials]
 * @returns {credentials is AuthWithTokens}
 */
export function hasAuthenticated(credentials) {
  return !!(
    credentials?.token &&
    credentials.idToken &&
    credentials.refreshToken
  )
}

/**
 * @param {AuthCredentials | null} [credentials]
 */
export function getUserClaims(credentials) {
  if (!credentials?.token) {
    return
  }

  const { decoded } = /** @type {UserToken<UserProfile>} */ (
    token.decode(credentials.token)
  )

  return decoded.payload
}

/**
 * @param {AuthCredentials | null} [credentials]
 */
export function getUser(credentials) {
  if (!credentials?.user) {
    return
  }

  return credentials.user
}

/**
 * @param {AuthCredentials | null} [credentials]
 * @returns {credentials is AuthSignedIn}
 */
export function hasUser(credentials) {
  return hasAuthenticated(credentials) && !!credentials.user
}

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').UserProfile} UserProfile
 */

/**
 * @typedef {Pick<AuthCredentials, 'token' | 'idToken' | 'refreshToken'>} Tokens - Known tokens
 * @typedef {Extract<AuthCredentials, Required<Tokens>>} AuthWithTokens - Auth credentials with tokens (but maybe no user session)
 * @typedef {Required<AuthCredentials>} AuthSignedIn - Auth credentials with tokens and user session
 */

/**
 * @template {object} Payload
 * @typedef {import('@hapi/jwt').HapiJwt.Artifacts<{ JwtPayload?: Payload }>} UserToken
 */
