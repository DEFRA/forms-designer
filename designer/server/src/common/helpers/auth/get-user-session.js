import { token } from '@hapi/jwt'
import { isPast, parseISO, subMinutes } from 'date-fns'

import { groupsToScopes } from '~/src/common/constants/scopes.js'
import { Roles } from '~/src/models/account/role-mapper.js'

/**
 * @param {Partial<Request> | Request<{ AuthArtifactsExtra: AuthArtifacts }> | Request<{ Query: { logoutHint?: string } }>} request
 * @param {{ sessionId: string, user: UserCredentials }} [session] - Session cookie state
 */
export async function getUserSession(request, session) {
  const { auth, server } = request

  // Check for existing user
  if (hasUser(auth?.credentials)) {
    return auth.credentials
  }

  // Prefer Session ID from cookie state
  let sessionId = session?.sessionId

  // Fall back to OpenID Connect (OIDC) claim
  if (!sessionId && hasAuthenticated(auth?.credentials)) {
    const claims = getUserClaims(auth.credentials)

    sessionId = claims.token.sub
  }

  // Retrieve user session from Redis
  if (sessionId) {
    return server?.methods.session.get(sessionId)
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
export function hasExpired(credentials) {
  if (!hasUser(credentials)) {
    return true
  }

  const { user } = credentials
  return !!user.expiresAt && isPast(subMinutes(parseISO(user.expiresAt), 1))
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
 * @param {AuthWithTokens} credentials
 * @param {ReturnType<typeof getUserClaims>} [claims]
 * @returns Array of scopes assigned to the user
 */
export function getUserScopes(credentials, claims) {
  const { token } = claims ?? getUserClaims(credentials)
  const { groups } = token

  // No groups assigned to the user
  if (!groups?.length) {
    return []
  }

  // Filter groups to assigned scopes
  const assignedScopes = Object.entries(groupsToScopes)
    .filter(([group]) => groups.includes(group))
    .flatMap(([, scopes]) => scopes)

  return assignedScopes
}

/**
 * @param {AuthCredentials | null} [credentials]
 * @returns {credentials is AuthSignedIn}
 */
export function hasUser(credentials) {
  return hasAuthenticated(credentials) && !!credentials.user
}

/**
 * Check if user has admin role
 * @param {EntitlementUser} user
 * @returns {boolean}
 */
export function hasAdminRole(user) {
  return user.roles.includes(Roles.Admin)
}

/**
 * @import { AuthArtifacts, AuthCredentials, Request, UserCredentials } from '@hapi/hapi'
 * @import { AuthSignedIn, AuthWithTokens, Tokens, UserProfile } from '~/src/common/helpers/auth/types.js'
 * @import { EntitlementUser } from '@defra/forms-model'
 */
