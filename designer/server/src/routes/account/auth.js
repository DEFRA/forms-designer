import Boom from '@hapi/boom'

import * as scopes from '~/src/common/constants/scopes.js'
import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'

export default [
  /**
   * @satisfies {ServerRoute<{ AuthArtifactsExtra: AuthArtifacts }>}
   */
  ({
    method: ['GET', 'POST'],
    path: '/auth/callback',
    async handler(request, h) {
      const { cookieAuth, yar } = request

      // Create user session
      const credentials = await createUserSession(request)

      if (!hasUser(credentials)) {
        return Boom.unauthorized()
      }

      // Add to authentication cookie for session validation
      cookieAuth.set({ sessionId: credentials.user.id })

      /**
       * Drop user sessions when scopes are missing but let users sign back in
       * @todo Keep users signed in but restrict route access by scope
       */
      if (!credentials.scope.includes(scopes.SCOPE_WRITE)) {
        await dropUserSession(request)

        // Redirect users to a help message
        yar.flash('userAuthFailed', true)
        return h.redirect('/')
      }

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
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
