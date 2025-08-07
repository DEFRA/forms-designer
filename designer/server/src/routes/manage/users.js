import { Scopes } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getUsers } from '~/src/lib/manage.js'
import * as viewModel from '~/src/models/manage/users.js'
import { checkUserManagementAccess } from '~/src/routes/forms/route-helpers.js'

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
        scope: [`+${Scopes.UserEdit}`]
      }
    },
    pre: [checkUserManagementAccess]
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
