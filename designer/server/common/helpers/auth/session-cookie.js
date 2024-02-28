import authCookie from '@hapi/cookie'
import { isPast, parseISO, subMinutes } from 'date-fns'

import config from "../../../config";
import { refreshAccessToken } from '../../../common/helpers/auth/refresh-token'
import {
  removeUserSession,
  updateUserSession
} from '../../../common/helpers/auth/user-session'

const sessionCookie = {
  plugin: {
    name: 'user-session',
    register: async (server) => {
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
        validate: async (request, session) => {
          const authedUser = await request.getUserSession()

          const tokenHasExpired = authedUser?.expiresAt
            ? isPast(subMinutes(parseISO(authedUser.expiresAt), 1))
            : true

          if (tokenHasExpired) {
            const response = await refreshAccessToken(request)
            const refreshAccessTokenJson = await response.json()

            if (!response.ok) {
              removeUserSession(request)

              return { isValid: false }
            }

            const updatedSession = await updateUserSession(
              request,
              refreshAccessTokenJson
            )

            return {
              isValid: true,
              credentials: updatedSession
            }
          }

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

      server.auth.default('session')
    }
  }
}

export { sessionCookie }
