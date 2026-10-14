import { Scopes } from '@defra/forms-model'

import { getUser } from '~/src/lib/manage.js'
import { accountViewModel } from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/account',
  async handler(request, h) {
    const { credentials } = request.auth
    const { token } = credentials

    const user = await getUser(
      token,
      /** @type {string} */ (credentials.user?.id)
    )

    return h.view('account/account', accountViewModel(user))
  },
  options: {
    auth: {
      mode: 'required',
      access: {
        entity: 'user',
        scope: [`+${Scopes.FormRead}`]
      }
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
