import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/sign-in',
  handler(request, h) {
    const userFailedAuthorisation =
      request.yar.flash('userFailedAuthorisation').length > 0

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
