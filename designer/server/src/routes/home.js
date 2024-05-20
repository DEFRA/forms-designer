import * as scopes from '~/src/common/constants/scopes.js'
import * as auth from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler(request, h) {
    if (request.auth.isAuthenticated) {
      return h.redirect('/library')
    }

    const model = auth.signInViewModel()
    return h.view('account/sign-in', model)
  },
  options: {
    auth: {
      mode: 'try',
      access: {
        entity: 'user',
        scope: [`+${scopes.SCOPE_READ}`]
      }
    }
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
