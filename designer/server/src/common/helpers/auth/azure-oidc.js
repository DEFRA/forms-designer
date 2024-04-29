import basic from '@hapi/basic'
import bell from '@hapi/bell'
import jwt from '@hapi/jwt'

import config from '~/src/config.js'

/**
 * @type {ServerRegisterPluginObject}
 */
const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(bell)

      const oidc = await fetch(config.oidcWellKnownConfigurationUrl).then(
        (res) => res.json()
      )

      const authCallbackUrl = config.appBaseUrl + '/auth/callback'

      // making the OIDC config available to server
      server.app.oidc = oidc

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          return authCallbackUrl
        },
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
          profile: async function (credentials) {
            const payload = jwt.token.decode(credentials.token).decoded.payload

            credentials.profile = {
              id: payload.oid,
              displayName: payload.name,
              email: payload.upn ?? payload.preferred_username,
              loginHint: payload.login_hint
            }
          }
        },
        password: config.sessionCookiePassword,
        clientId: config.azureClientId,
        clientSecret: config.azureClientSecret,
        providerParams: {
          redirect_uri: authCallbackUrl
        },
        cookie: 'bell-azure-oidc',
        isSecure: false,
        config: {
          tenant: config.azureTenantId
        }
      })
    }
  }
}

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
const azureOidcNoop = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(basic)

      server.auth.strategy('azure-oidc', 'basic', {
        location: (request) => {
          return authCallbackUrl
        },
        validate: (request, username, password, h) => {
          const user = dummyUsers[username]
          if (!user) {
            return { credentials: null, isValid: false }
          }

          const isValid = password === user.password
          const credentials = {
            profile: {
              id: user.id,
              displayName: user.name,
              email: `dummy@defra.gov.uk`,
              loginHint: '1234'
            }
          }

          return { isValid, credentials }
        }
      })
    }
  }
}

export { azureOidc, azureOidcNoop }

/**
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */
