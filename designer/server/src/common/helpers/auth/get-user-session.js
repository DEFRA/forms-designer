import { token } from '@hapi/jwt'

/**
 * @param {Request} request
 * @param {{ sessionId: string, user: UserCredentials }} [session] - Session cookie state
 */
export async function getUserSession(request, session) {
  const { auth, server } = request
  const { credentials } = auth

  // Check for existing user
  if (hasUser(credentials)) {
    return credentials
  }

  // Prefer Session ID from cookie state
  let sessionId = session?.sessionId

  // Fall back to OpenID Connect (OIDC) claim
  if (!sessionId && hasAuthenticated(credentials)) {
    const { token } = getUserClaims(credentials)

    sessionId = token.sub
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
 * @param {AuthWithTokens} credentials
 */
export function getUserClaims(credentials) {
  const tokens = /** @satisfies {[keyof Tokens, string][]} */ ([
    ['token', 'access token'],
    ['idToken', 'ID token']
  ])

  /**
   * @satisfies {[keyof Tokens, UserProfile][]}
   */
  const entries = tokens.map(([key, description]) => {
    const { decoded } = token.decode(credentials[key])

    if (!decoded.payload) {
      throw new Error(
        `Failed to decode ${description}: auth.credentials.${key}`
      )
    }

    return [key, decoded.payload]
  })

  return /** @type {Record<keyof Tokens, UserProfile>} */ (
    Object.fromEntries(entries)
  )
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
 * @typedef {Pick<AuthCredentials, 'token' | 'idToken'>} Tokens - Known tokens
 * @typedef {Extract<AuthCredentials, Required<Tokens>>} AuthWithTokens - Auth credentials with tokens (but maybe no user session)
 * @typedef {Required<AuthCredentials>} AuthSignedIn - Auth credentials with tokens and user session
 */

/**
 * @template {object} Payload
 * @typedef {import('@hapi/jwt').HapiJwt.Artifacts<{ JwtPayload?: Payload }>} UserToken
 */
