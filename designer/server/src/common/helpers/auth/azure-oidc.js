import Basic from '@hapi/basic'
import Bell from '@hapi/bell'
import { token } from '@hapi/jwt'
import { DateTime } from 'luxon'

import config from '~/src/config.js'
import * as oidc from '~/src/lib/oidc.js'

const authCallbackUrl = new URL(`/auth/callback`, config.appBaseUrl)

export const scope = [
  `api://${config.azureClientId}/forms.user`,
  'openid',
  'profile',
  'email',
  'offline_access'
]

/**
 * @type {ServerRegisterPluginObject}
 */
export const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Bell)

      const wellKnownConfiguration = await oidc.getWellKnownConfiguration()

      server.auth.strategy(
        'azure-oidc',
        'bell',
        /** @type {ProviderBell} */ ({
          provider: {
            name: 'azure-oidc',
            protocol: 'oauth2',
            useParamsAuth: true,
            auth: wellKnownConfiguration.authorization_endpoint,
            token: wellKnownConfiguration.token_endpoint,
            scope,
            profile(credentials, params) {
              const artifacts = token.decode(credentials.token)
              const idToken = token.decode(params.id_token)

              token.verifyTime(artifacts)
              token.verifyPayload(artifacts)

              token.verifyTime(idToken)
              token.verifyPayload(idToken)

              return Promise.resolve()
            }
          },
          location() {
            return authCallbackUrl.href
          },
          clientId: config.azureClientId,
          clientSecret: config.azureClientSecret,
          cookie: 'bell-azure-oidc',
          isSecure: config.isProduction,
          password: config.sessionCookiePassword
        })
      )
    }
  }
}

/**
 * @type {Partial<Record<string, { password: string, user: UserCredentials }>>}
 */
const dummyUsers = {
  defra: {
    password: 'testing', // 'secret'
    user: {
      id: 'dummy-id',
      email: 'dummy@defra.gov.uk',
      displayName: 'John Smith',
      issuedAt: DateTime.now().minus({ minutes: 30 }).toUTC().toISO(),
      expiresAt: DateTime.now().plus({ minutes: 30 }).toUTC().toISO()
    }
  }
}

/**
 * @type {ServerRegisterPluginObject}
 */
export const azureOidcNoop = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Basic)

      server.auth.strategy(
        'azure-oidc',
        'basic',
        /** @type {ProviderBasic} */ ({
          validate(request, username, password) {
            const credentials = dummyUsers[username]

            // No matching user found
            if (!credentials || credentials.password !== password) {
              return Promise.resolve({ isValid: false })
            }

            const { user } = credentials

            return Promise.resolve({
              credentials: { user },
              isValid: true
            })
          }
        })
      )
    }
  }
}

/**
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */

/**
 * @typedef {{ validate: import('@hapi/basic').Validate }} ProviderBasic - Basic provider options
 * @typedef {import('@hapi/bell').BellOptions} ProviderBell - Bell provider options
 * @typedef {import('@hapi/bell').Credentials2} Credentials - Provider OAuth2 credentials
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials - User credentials
 * @typedef {import('oidc-client-ts').OidcMetadata} OidcMetadata - OpenID Connect (OIDC) metadata
 * @typedef {import('oidc-client-ts').UserProfile & { groups?: string[], unique_name?: string }} UserProfile - User profile
 */
