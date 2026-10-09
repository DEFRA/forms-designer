import Boom from '@hapi/boom'
import { token } from '@hapi/jwt'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'
import { publishAuthenticationLoginEvent } from '~/src/messaging/publish.js'
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

      const logoutHint = yar.flash(sessionNames.logoutHint).at(0) // logoutHint on the outbound is the same value as loginHint on the inbound

      if (logoutHint) {
        // e.g. for duplicate sessions
        return h.redirect(
          `/auth/sign-out?logoutHint=${encodeURIComponent(logoutHint)}`
        )
      }

      // Create user session
      const credentials = await createUserSession(request)

      if (!hasUser(credentials)) {
        return Boom.unauthorized()
      }

      // Add to authentication cookie for session validation
      cookieAuth.set({
        sessionId: credentials.user.id,
        flowId: credentials.flowId, // always store the latest flowId so we can detect stale sessions later
        loginHint: getLoginHint(credentials.token) // so we can hint to AAD which account to sign the user out of
      })

      const redirect =
        yar.flash(sessionNames.redirectTo).at(0) ?? formsLibraryPath

      const auditUser = mapUserForAudit(credentials.user)
      await publishAuthenticationLoginEvent(auditUser)

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
 * Gets a login hint from an access token, if it exists.
 * @param {string} accessToken
 * @throws {Error} If the login hint is missing or not a string
 */
export function getLoginHint(accessToken) {
  const accessTokenDecoded = /** @type {{login_hint?: string}} */ (
    token.decode(accessToken).decoded.payload
  )

  if (!('login_hint' in accessTokenDecoded)) {
    throw new Error('Missing login_hint in token')
  }

  if (typeof accessTokenDecoded.login_hint !== 'string') {
    throw new Error('login_hint in token is not a string')
  }

  return accessTokenDecoded.login_hint
}

/**
 * @import { AuthArtifacts, ServerRoute } from '@hapi/hapi'
 */
