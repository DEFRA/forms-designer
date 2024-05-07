import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/sign-in',
  async handler(request, h) {
    const isAuthenticated = request.auth.isAuthenticated
    let userFailedAuthorisation = false

    if (isAuthenticated && (request.auth.credentials.scope ?? []).length > 0) {
      return h.redirect('/library')
    } else if (isAuthenticated) {
      request.yar.flash('referrer', request.url.href) // refresh the page to show the error message
      userFailedAuthorisation = true
      await dropUserSession(request)
    }

    const model = auth.signInViewModel(userFailedAuthorisation)
    return h.view('account/sign-in', model)
  },
  options: {
    auth: {
      mode: 'optional'
    }
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
