import { join } from 'node:path'

import { auth } from '~/src/auth/index.js'
import config from '~/src/config.js'
import { home } from '~/src/home/index.js'
import { login } from '~/src/login/index.js'
import { logout } from '~/src/logout/index.js'
import routes from '../routes/index.js'

export default {
  plugin: {
    name: 'router',
    register: async (server, options) => {
      await server.route(routes)
    }
  }
}
