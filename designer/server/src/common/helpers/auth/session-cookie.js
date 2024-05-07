import authCookie from '@hapi/cookie'

import config from '~/src/config.js'

/**
 * @type {ServerRegisterPluginObject}
 */
const sessionCookie = {
  plugin: {
    name: 'user-session',
    async register(server) {
      await server.register(authCookie)

      server.auth.strategy('session', 'cookie', {
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
         */
        async validate(request, session) {
          const authedUser = await request.getUserSession()

          const userSession = await server.app.cache.get(session.sessionId)

          if (userSession) {
            return {
              isValid: true,
              credentials: userSession
            }
          }

          return { isValid: false }
        }
      })

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
