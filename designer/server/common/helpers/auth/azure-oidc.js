import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import config from "../../../config";

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      const oidc = await fetch(
        config.oidcWellKnownConfigurationUrl
      ).then((res) => res.json())

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
            //`api://${config.azureClientId}/forms.user`,
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

export { azureOidc }
