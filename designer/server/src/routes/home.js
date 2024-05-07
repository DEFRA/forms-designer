import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler(request, h) {
    if (request.auth.isAuthenticated) {
      return h.redirect('/library')
    }

    const model = auth.signedOutViewModel()
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
