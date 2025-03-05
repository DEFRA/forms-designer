import Boom from '@hapi/boom'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'
import { formsLibraryPath } from '~/src/models/links.js'

export default [
  /**
   * @satisfies {ServerRoute<{ AuthArtifactsExtra: AuthArtifacts }>}
   */
  ({
    method: ['GET', 'POST'],
    path: '/auth/callback',
    async handler(request, h) {
      const { cookieAuth, yar } = request

      const forceSignOut = yar.flash(sessionNames.forceSignOut).at(0) ?? false

      if (forceSignOut) {
        // e.g. for duplicate sessions
        return h.redirect('/auth/sign-out?force=true')
      }

      // Create user session
      const credentials = await createUserSession(request)

      if (!hasUser(credentials)) {
        return Boom.unauthorized()
      }

      // Add to authentication cookie for session validation
      cookieAuth.set({
        sessionId: credentials.user.id,
        flowId: credentials.flowId // always store the latest flowId so we can detect stale sessions later
      })

      const redirect =
        yar.flash(sessionNames.redirectTo).at(0) ?? formsLibraryPath

      return h.redirect(redirect)
    },
    options: {
      auth: {
        strategies: ['azure-oidc'],
        access: {
          scope: false
        }
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
 * @import { AuthArtifacts, ServerRoute } from '@hapi/hapi'
 */
