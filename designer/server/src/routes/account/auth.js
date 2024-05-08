import Boom from '@hapi/boom'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
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

      if (!credentials?.user) {
        return Boom.unauthorized()
      }

      if ((credentials.scope ?? []).length === 0) {
        // temporarily drop the user session to allow them to sign back in again if they gain permission
        // ideally though we'd let them progress into the app and just restrict the data we show them
        // `credentials` essentially serves a short-lived helper to build out the scopes
        yar.flash('userFailedAuthorisation', true)
        await dropUserSession(request)

        return h.redirect('/')
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
