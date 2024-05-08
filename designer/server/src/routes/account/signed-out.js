import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/signed-out',
  handler(_, h) {
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
