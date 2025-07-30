import * as scopes from '~/src/common/constants/scopes.js'
import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import { accountViewModel } from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/account',
  handler(request, h) {
    const { credentials } = request.auth

    // Skip when not authenticated
    if (!hasUser(credentials)) {
      return h.redirect('/')
    }

    return h.view('account/account', accountViewModel(credentials))
  },
  options: {
    auth: {
      mode: 'required',
      access: {
        entity: 'user',
        scope: [`+${scopes.SCOPE_READ}`]
      }
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
