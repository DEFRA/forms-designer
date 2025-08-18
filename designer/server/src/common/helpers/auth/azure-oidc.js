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
 * @type {ServerRegisterPluginObject<void>}
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
        /** @type {BellOptions} */ ({
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
          isSecure: config.isSecure,
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
 * @type {ServerRegisterPluginObject<void>}
 */
export const azureOidcNoop = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Basic)

      server.auth.strategy(
        'azure-oidc',
        'basic',
        /** @type {{ validate: BasicOptions.Validate }} */ ({
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
 * @import BasicOptions from '@hapi/basic'
 * @import { BellOptions } from '@hapi/bell'
 * @import { ServerRegisterPluginObject, UserCredentials } from '@hapi/hapi'
 */
