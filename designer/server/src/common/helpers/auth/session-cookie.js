import authCookie from '@hapi/cookie'

import {
  getUserSession,
  hasUser
} from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'

/**
 * @type {ServerRegisterPluginObject}
 */
const sessionCookie = {
  plugin: {
    name: 'user-session',
    async register(server) {
      await server.register(authCookie)

      server.auth.strategy(
        'session',
        'cookie',
        /** @type {ProviderCookie} */ ({
          cookie: {
            name: 'userSession',
            path: '/',
            password: config.sessionCookiePassword,
            isSecure: config.isProduction,
            ttl: config.sessionCookieTtl
          },
          keepAlive: true,

          /**
           * Redirect invalid session to callback route
           */
          redirectTo() {
            return '/auth/callback'
          },

          /**
           * Validate session using auth credentials
           * @param {Request} [request]
           * @param {{ sessionId: string, user: UserCredentials }} [session] - Session cookie state
           */
          async validate(request, session) {
            if (!request) {
              return { isValid: false }
            }

            const credentials = await getUserSession(request, session)

            return {
              credentials,
              isValid: hasUser(credentials)
            }
          }
        })
      )

      server.auth.default({
        strategies: ['azure-oidc', 'session']
      })
    }
  }
}

export { sessionCookie }

/**
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */

/**
 * @typedef {import('@hapi/cookie').Options} ProviderCookie
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 */
