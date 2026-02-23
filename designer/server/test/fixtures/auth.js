import { Scopes } from '@defra/forms-model'
import { token } from '@hapi/jwt'
import { DateTime, Duration } from 'luxon'

import config from '~/src/config.js'
import { Roles } from '~/src/models/account/role-mapper.js'

const issuedAt = DateTime.now().minus({ minutes: 30 })
const expiresAt = DateTime.now().plus({ minutes: 30 })

/**
 * @param {Pick<UserProfile, 'groups'> & Pick<UserProfile, 'login_hint'>} [options]
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
    oid: 'dummy_object_id',
    groups: options?.groups,
    login_hint: options?.login_hint
  })
}

/**
 * @param {UserProfile} token
 * @param {string[]} [roles]
 */
export function user(token, roles = []) {
  return /** @satisfies {UserCredentials} */ ({
    id: config.featureFlagUseEntitlementApi
      ? (token.oid ?? token.sub)
      : token.sub,
    email: token.email,
    displayName: token.name ?? '',
    issuedAt: issuedAt.toUTC().toISO(),
    expiresAt: expiresAt.toUTC().toISO(),
    roles
  })
}

/**
 * @param {Record<keyof Tokens, ReturnType<typeof profile>>} claims
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
 * @param {Pick<AuthCredentials, 'user' | 'scope'> & { claims: Parameters<typeof artifacts>[0] }} options
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
    expiresIn: tokens.expires_in,
    flowId: ''
  })
}

const claims = {
  token: profile({ groups: ['valid-test-group'], login_hint: 'foo' }),
  idToken: profile()
}

const claimsGroupsInvalid = {
  token: profile({ groups: ['invalid-test-group'], login_hint: 'foo' }),
  idToken: profile()
}

const claimsGroupsEmpty = {
  token: profile({ groups: [], login_hint: 'foo' }),
  idToken: profile()
}

/**
 * Request auth with scopes for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authSuperAdmin = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claims),
  credentials: credentials({
    claims,
    user: user(claims.token, [Roles.Superadmin]),
    scope: [
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormPublish,
      Scopes.FormRead,
      Scopes.UserCreate,
      Scopes.UserDelete,
      Scopes.UserEdit,
      Scopes.FormsFeedback,
      Scopes.FormsBackup,
      Scopes.ResetSaveAndExit
    ]
  })
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
    user: user(claims.token, [Roles.Admin]),
    scope: [
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormPublish,
      Scopes.FormRead,
      Scopes.UserCreate,
      Scopes.UserDelete,
      Scopes.UserEdit,
      Scopes.FormsFeedback
    ]
  })
}

/**
 * Request auth with scopes for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authFormPublisher = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claims),
  credentials: credentials({
    claims,
    user: user(claims.token, [Roles.FormCreator]),
    scope: [
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormDelete,
      Scopes.FormPublish
    ]
  })
}

/**
 * Request auth with scopes for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authFormCreator = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claims),
  credentials: credentials({
    claims,
    user: user(claims.token, [Roles.FormCreator]),
    scope: [Scopes.FormEdit, Scopes.FormRead, Scopes.FormDelete]
  })
}

/**
 * Request auth with invalid groups for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authGroupsInvalid = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claimsGroupsInvalid),
  credentials: credentials({
    claims: claimsGroupsInvalid,
    user: user(claimsGroupsInvalid.token)
  })
}

/**
 * Request auth without scopes for Hapi `server.inject()`
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authScopesEmpty = {
  strategy: 'azure-oidc',
  artifacts: artifacts(claimsGroupsEmpty),
  credentials: credentials({
    claims: claimsGroupsEmpty
  })
}

/**
 * @import { AuthArtifacts, AuthCredentials, ServerInjectOptions, UserCredentials } from '@hapi/hapi'
 * @import { Tokens, UserProfile } from '~/src/common/helpers/auth/types.js'
 */
