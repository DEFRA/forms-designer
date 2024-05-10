import Boom from '@hapi/boom'

import { createUserSession } from '~/src/common/helpers/auth/user-session.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: ['GET', 'POST'],
    path: '/auth/callback',
    async handler(request, h) {
      const { cookieAuth, yar } = request

      // Create user session
      const credentials = await createUserSession(request)

      if (!credentials?.scope) {
        return h.redirect('/')
      }

      if (!credentials.user) {
        return Boom.unauthorized()
      }

      // Add to authentication cookie for session validation
      cookieAuth.set({ sessionId: credentials.user.id })

      const redirect = yar.flash('referrer').at(0) ?? '/library'
      return h.redirect(redirect)
    },
    options: {
      auth: {
        strategies: ['azure-oidc']
      },

      response: {
        failAction(request, h, error) {
          return Boom.unauthorized(error)
        }
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
