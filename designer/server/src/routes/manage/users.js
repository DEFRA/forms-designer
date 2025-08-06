import Boom from '@hapi/boom'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { getUsers } from '~/src/lib/manage.js'
import * as viewModel from '~/src/models/manage/users.js'

const notificationKey = sessionNames.successNotification

export default /** @type {ServerRoute} */
({
  method: 'GET',
  path: '/manage/users',
  async handler(request, h) {
    const { auth, yar } = request
    const { token } = auth.credentials

    // Get list of users
    const users = await getUsers(token)

    // Saved banner
    const notification = /** @type {string[] | undefined} */ (
      yar.flash(notificationKey).at(0)
    )

    return h.view(
      'manage/users',
      viewModel.listUsersViewModel(users, notification)
    )
  },
  options: {
    auth: {
      mode: 'required',
      access: {
        entity: 'user',
        scope: [`+${scopes.SCOPE_WRITE}`]
      }
    },
    pre: [
      {
        method: /** @param {import('@hapi/hapi').Request} request */ (
          request
        ) => {
          if (!config.featureFlagUseEntitlementApi) {
            throw Boom.forbidden('User management is not available')
          }
          const { credentials } = request.auth
          if (!hasAdminRole(credentials.user)) {
            throw Boom.forbidden('Admin access required')
          }
          return true
        }
      }
    ]
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
