import { DateTime } from 'luxon'

/**
 * @satisfies {ServerInjectOptions['auth']}
 */
export const auth = {
  strategy: 'azure-oidc',
  credentials: /** @satisfies {AuthCredentials} */ ({
    user: {
      id: 'dummy-id',
      email: 'dummy@defra.gov.uk',
      displayName: 'John Smith',
      loginHint: 'dummy-login-hint',
      isAuthenticated: true,
      token: 'dummy-token',
      refreshToken: 'dummy-refresh-token',
      expiresIn: 30 * 60 * 1000,
      expiresAt: DateTime.now().plus({ minutes: 30 }).toJSDate()
    }
  })
}

/**
 * @typedef {import('~/src/common/helpers/auth/get-user-session.js').UserSession} UserSession
 * @typedef {import('@hapi/hapi').AuthCredentials<UserSession>} AuthCredentials
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 */
