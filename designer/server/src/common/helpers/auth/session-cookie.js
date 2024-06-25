import authCookie from '@hapi/cookie'

import {
  getUserSession,
  hasExpired,
  hasUser
} from '~/src/common/helpers/auth/get-user-session.js'
import { refreshAccessToken } from '~/src/common/helpers/auth/refresh-token.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'
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
          redirectTo(request) {
            if (request) {
              const { url, yar } = request

              // Remember current location for later
              yar.flash('redirectTo', url.pathname)
            }

            // Redirect to callback route
            return '/auth/callback'
          },

          /**
           * Validate session using auth credentials
           * @param {Request<{ AuthArtifactsExtra: AuthArtifacts }>} [request]
           * @param {{ sessionId: string, user: UserCredentials }} [session] - Session cookie state
           */
          async validate(request, session) {
            if (!request) {
              return { isValid: false }
            }

            let credentials = await getUserSession(request, session)

            if (hasUser(credentials)) {
              const { auth } = request

              // Rebuild credentials from Redis session
              auth.credentials = credentials

              // Refresh session when token has expired
              if (hasExpired(credentials)) {
                const { body: artifacts } = await refreshAccessToken(request)
                credentials = await createUserSession(request, artifacts)
              }
            }

            return {
              isValid: !hasExpired(credentials),
              credentials
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
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').Request<ReqRef>} Request
 */

/**
 * @typedef {import('@hapi/cookie').Options} ProviderCookie
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials
 */
