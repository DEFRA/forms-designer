import { provideAuthedUser } from '~/src/common/helpers/auth/pre/provide-authed-user.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/sign-out',
  handler(request, h) {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect('/library')
    }

    const logoutBaseUrl = request.server.app.oidc.end_session_endpoint
    const referrer = request.info.referrer

    const logoutUrl = encodeURI(
      `${logoutBaseUrl}?post_logout_redirect_uri=${referrer}`
    )

    request.dropUserSession()
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  },
  options: {
    pre: [provideAuthedUser]
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
