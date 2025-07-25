import * as scopes from '~/src/common/constants/scopes.js'
import { getUsers } from '~/src/lib/manage.js'
import * as viewModel from '~/src/models/manage/users.js'

export default /** @type {ServerRoute} */
({
  method: 'GET',
  path: '/manage/users',
  async handler(request, h) {
    const { auth } = request
    const { token } = auth.credentials

    // Get list of users
    const users = await getUsers(token)

    return h.view('manage/users', viewModel.usersViewModel(users))
  },
  options: {
    auth: {
      mode: 'required',
      access: {
        entity: 'user',
        scope: [`+${scopes.SCOPE_WRITE}`]
      }
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
