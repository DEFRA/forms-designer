import Basic from '@hapi/basic'
import Bell from '@hapi/bell'
import Boom from '@hapi/boom'
import { token } from '@hapi/jwt'

import config from '~/src/config.js'

const authCallbackUrl = new URL(`/auth/callback`, config.appBaseUrl)

/**
 * @type {ServerRegisterPluginObject}
 */
export const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Bell)

      if (
        !config.azureClientId ||
        !config.azureClientSecret ||
        !config.oidcWellKnownConfigurationUrl
      ) {
        throw Boom.unauthorized()
      }

      const oidc = await fetch(config.oidcWellKnownConfigurationUrl).then(
        (response) => /** @type {Promise<OidcMetadata>} */ (response.json())
      )

      // making the OIDC config available to server
      server.app.oidc = oidc

      server.auth.strategy(
        'azure-oidc',
        'bell',
        /** @type {ProviderBell} */ ({
          provider: {
            name: 'azure-oidc',
            protocol: 'oauth2',
            useParamsAuth: true,
            auth: oidc.authorization_endpoint,
            token: oidc.token_endpoint,
            scope: [
              // TODO re-enable
              // `api://${config.azureClientId}/forms.user`,
              'openid',
              'profile',
              'email',
              'offline_access',
              'user.read'
            ],
            profile(credentials) {
              const { decoded } = /** @type {UserToken} */ (
                token.decode(credentials.token)
              )

              if (!decoded.payload) {
                throw Boom.unauthorized()
              }

              const { payload } = decoded

              credentials.profile = {
                id: payload.oid,
                displayName: payload.name,
                email: payload.upn ?? payload.preferred_username,
                loginHint: payload.login_hint
              }

              return Promise.resolve()
            }
          },
          location() {
            return authCallbackUrl.href
          },
          password: config.sessionCookiePassword,
          clientId: config.azureClientId,
          clientSecret: config.azureClientSecret,
          providerParams: {
            redirect_uri: authCallbackUrl.href
          },
          cookie: 'bell-azure-oidc',
          isSecure: false,
          config: {
            tenant: config.azureTenantId
          }
        })
      )
    }
  }
}

/**
 * @type {Partial<Record<string, { username: string, password: string, name: string, id: string }>>}
 */
const dummyUsers = {
  defra: {
    username: 'defra',
    password: 'testing', // 'secret'
    name: 'Joe Bloggs',
    id: '2133d32a'
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
            const user = dummyUsers[username]

            if (!user || user.password !== password) {
              return Promise.resolve({
                isValid: false
              })
            }

            const credentials = {
              profile: {
                id: user.id,
                displayName: user.name,
                email: `dummy@defra.gov.uk`,
                loginHint: '1234'
              }
            }

            return Promise.resolve({
              credentials,
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
 * @typedef {import('oidc-client-ts').OidcMetadata} OidcMetadata - OpenID Connect (OIDC) metadata
 * @typedef {import('oidc-client-ts').UserProfile} UserProfile - User profile
 * @typedef {import('@hapi/jwt').HapiJwt.Artifacts<{ JwtPayload?: UserProfile }>} UserToken - User token
 */
