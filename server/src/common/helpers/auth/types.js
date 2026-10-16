/**
 * @import { AuthCredentials } from '@hapi/hapi'
 * @import { IdTokenClaims } from 'oidc-client-ts'
 */

/**
 * @typedef {Pick<AuthCredentials, 'token' | 'idToken'>} Tokens - Known tokens
 * @typedef {IdTokenClaims & { groups?: string[], unique_name?: string, login_hint?: string, oid?: string }} UserProfile - User profile
 * @typedef {Extract<AuthCredentials, Required<Tokens>>} AuthWithTokens - Auth credentials with tokens (but maybe no user session)
 * @typedef {Required<AuthCredentials>} AuthSignedIn - Auth credentials with tokens and user session
 */
