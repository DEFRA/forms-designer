import { token } from '@hapi/jwt'
import { DateTime, Duration } from 'luxon'

const issuedAt = DateTime.now().minus({ minutes: 30 })
const expiresAt = DateTime.now().plus({ minutes: 30 })

/**
 * @satisfies {UserProfile}
 */
export const profile = {
  aud: 'dummy-aud',
  iss: 'https://login.microsoftonline.com/dummy-tid/v2.0',
  iat: issuedAt.toUTC().toSeconds(),
  nbf: issuedAt.toUTC().toSeconds(),
  exp: expiresAt.toUTC().toSeconds(),
  name: 'John Smith',
  email: 'dummy@defra.gov.uk',
  given_name: 'John',
  family_name: 'Smith',
  sub: 'dummy_session_id'
}

/**
 * @satisfies {UserCredentials}
 */
export const user = {
  id: profile.sub,
  email: profile.email,
  displayName: profile.name,
  issuedAt: issuedAt.toUTC().toISO(),
  expiresAt: expiresAt.toUTC().toISO()
}

/**
 * @satisfies {AuthArtifacts}
 */
export const artifacts = {
  token_type: 'Bearer',
  scope: 'email openid profile User.Read',
  expires_in: Duration.fromObject({ minutes: 30 }).as('seconds'),
  ext_expires_in: Duration.fromObject({ minutes: 30 }).as('seconds'),
  access_token: token.generate(profile, 'testSecret'),
  id_token: token.generate(profile, 'testSecret'),
  refresh_token: 'dummy-encrypted-token'
}

/**
 * @satisfies {AuthCredentials}
 */
export const credentials = {
  provider: 'azure-oidc',
  user,
  query: {},
  token: artifacts.access_token,
  idToken: artifacts.id_token,
  refreshToken: artifacts.refresh_token,
  expiresIn: artifacts.expires_in
}

/**
 * @satisfies {ServerInjectOptions['auth']}
 */
export const auth = {
  strategy: 'azure-oidc',
  credentials,
  artifacts
}

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 * @typedef {import('~/src/common/helpers/auth/azure-oidc.js').UserProfile} UserProfile
 */
