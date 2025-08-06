import * as scopes from '~/src/common/constants/scopes.js'
import config from '~/src/config.js'
import { getUser } from '~/src/lib/manage.js'
import { accountViewModel } from '~/src/models/account/auth.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/auth/account',
  async handler(request, h) {
    if (!config.featureFlagUseEntitlementApi) {
      return h.redirect('/library')
    }

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
        scope: [`+${scopes.SCOPE_READ}`]
      }
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
