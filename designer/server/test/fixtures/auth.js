import { token } from '@hapi/jwt'
import { DateTime, Duration } from 'luxon'

import { SCOPE_READ, SCOPE_WRITE } from '~/src/common/constants/scopes.js'

const issuedAt = DateTime.now().minus({ minutes: 30 })
const expiresAt = DateTime.now().plus({ minutes: 30 })

/**
 * @param {Pick<UserProfile, 'groups'>} [options]
 */
export function profile(options) {
  return /** @satisfies {UserProfile} */ ({
    aud: 'dummy-aud',
    iss: 'https://login.microsoftonline.com/dummy-tid/v2.0',
    iat: issuedAt.toUTC().toSeconds(),
    nbf: issuedAt.toUTC().toSeconds(),
    exp: expiresAt.toUTC().toSeconds(),
    name: 'John Smith',
    email: 'dummy@defra.gov.uk',
    given_name: 'John',
    family_name: 'Smith',
    sub: 'dummy_session_id',
    groups: options?.groups
  })
}

/**
 * @param {UserProfile} token
 */
export function user(token) {
  return /** @satisfies {UserCredentials} */ ({
    id: token.sub,
    email: token.email,
    displayName: token.name ?? '',
    issuedAt: issuedAt.toUTC().toISO(),
    expiresAt: expiresAt.toUTC().toISO()
  })
}

/**
 * @param {TokenClaims} claims
 */
export function artifacts(claims) {
  return /** @satisfies {AuthArtifacts} */ ({
    token_type: 'Bearer',
    scope: 'email openid profile User.Read',
    expires_in: Duration.fromObject({ minutes: 30 }).as('seconds'),
    ext_expires_in: Duration.fromObject({ minutes: 30 }).as('seconds'),
    access_token: token.generate(claims.token, 'testSecret'),
    id_token: token.generate(claims.idToken, 'testSecret'),
    refresh_token: 'dummy-encrypted-token'
  })
}

/**
 * Credentials with tokens, user session and editor scopes
 * @param {Pick<AuthCredentials, 'user' | 'scope'> & { claims: TokenClaims }} options
 */
export function credentials(options) {
  const tokens = artifacts(options.claims)

  return /** @satisfies {AuthCredentials} */ ({
    provider: 'azure-oidc',
    scope: options.scope,
    user: options.user,
    query: {},
    token: tokens.access_token,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in
  })
}

const claims = {
  token: profile(),
  idToken: profile({ groups: ['valid-test-group'] })
}

/**
 * Request auth with scopes for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const auth = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claims),
  credentials: credentials({
    claims,
    user: user(claims.idToken),
    scope: [SCOPE_READ, SCOPE_WRITE]
  })
}

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').UserProfile} UserProfile
 * @typedef {import('~/src/common/helpers/auth/get-user-session.js').Tokens} Tokens
 * @typedef {Record<keyof Tokens, ReturnType<typeof profile>>} TokenClaims
 */
