import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler(request, h) {
    const isAuthenticated = request.auth.isAuthenticated
    let userFailedAuthorisation = false

    if (isAuthenticated && (request.auth.credentials.scope ?? []).length > 0) {
      return h.redirect('/library')
    } else if (isAuthenticated) {
      request.yar.flash('referrer', request.url.href) // refresh the page to show the error message
      userFailedAuthorisation = true
    }

    const model = auth.signedOutViewModel(userFailedAuthorisation)
    return h.view('account/signed-out', model)
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
