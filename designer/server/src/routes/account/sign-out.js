import { URL } from 'node:url'

import Joi from 'joi'

import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import * as oidc from '~/src/lib/oidc.js'

const redirectUrl = new URL(`/account/signed-out`, config.appBaseUrl)

export default /** @satisfies {ServerRoute<{ Params: { force: boolean }}>} */ ({
  method: 'GET',
  path: '/auth/sign-out',
  async handler(request, h) {
    const { credentials } = request.auth
    const { force } = request.query

    // Skip OpenID Connect (OIDC) when not authenticated
    if (!force && (!hasUser(credentials) || config.isTest)) {
      await dropUserSession(request)
      return h.redirect('/')
    }

    const wellKnownConfiguration = await oidc.getWellKnownConfiguration()

    // Build end session URL
    const endSessionUrl = new URL(wellKnownConfiguration.end_session_endpoint)
    endSessionUrl.searchParams.set('client_id', config.azureClientId)
    endSessionUrl.searchParams.set('post_logout_redirect_uri', redirectUrl.href)
    // TODO add logout_hint as a parameter to force sign out on the active account rather than showing the picker

    await dropUserSession(request)

    // Redirect to end session URL
    return h.redirect(endSessionUrl.href)
  },
  options: {
    validate: {
      query: Joi.object({
        force: Joi.boolean().default(false) // in the event we don't yet have a session locally but one exists in AAD, we can force sign them out
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
 * @import { ServerRoute } from '@hapi/hapi'
 */
