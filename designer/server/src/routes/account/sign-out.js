import { URL } from 'node:url'

import Joi from 'joi'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import config from '~/src/config.js'
import * as oidc from '~/src/lib/oidc.js'
import {
  publishAuthenticationLogoutDifferentDeviceEvent,
  publishAuthenticationLogoutManualEvent
} from '~/src/messaging/publish.js'
import { getLoginHint } from '~/src/routes/account/auth.js'

const redirectUrl = new URL(`/account/signed-out`, config.appBaseUrl)

export default /** @satisfies {ServerRoute<{ Query: { logoutHint?: string }}>} */ ({
  method: 'GET',
  path: '/auth/sign-out',
  async handler(request, h) {
    const { credentials } = request.auth
    const { logoutHint } = request.query

    // Skip OpenID Connect (OIDC) when not authenticated
    if (!logoutHint && (!hasUser(credentials) || config.isTest)) {
      await dropUserSession(request)
      return h.redirect('/')
    }

    const wellKnownConfiguration = await oidc.getWellKnownConfiguration()

    // Build end session URL
    const endSessionUrl = new URL(wellKnownConfiguration.end_session_endpoint)
    endSessionUrl.searchParams.set('post_logout_redirect_uri', redirectUrl.href)
    endSessionUrl.searchParams.set(
      'logout_hint',
      logoutHint ?? getLoginHint(credentials.token) // take the logout hint from the request if provided (force signout), else find it from the user's session
    )

    const loggedInUser = mapUserForAudit(credentials.user)

    await dropUserSession(request)

    if (logoutHint) {
      await publishAuthenticationLogoutDifferentDeviceEvent(loggedInUser)
    } else {
      await publishAuthenticationLogoutManualEvent(loggedInUser)
    }

    // Redirect to end session URL
    return h.redirect(endSessionUrl.href)
  },
  options: {
    validate: {
      query: Joi.object({
        logoutHint: Joi.string().optional() // in the event we don't yet have a session locally but one exists in AAD, we can force sign them out
      })
    },
    auth: {
      mode: 'try',
      access: {
        scope: false
      }
    }
  }
})

/**
 * @import { ServerRoute, UserCredentials } from '@hapi/hapi'
 */
