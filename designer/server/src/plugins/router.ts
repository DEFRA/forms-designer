import { type ServerRegisterPluginObject } from '@hapi/hapi'

import * as routes from '~/src/routes/index.js'

export default {
  plugin: {
    name: 'router',
    register(server) {
      server.route(routes.api)
      server.route(routes.assets)
      server.route(routes.auth)
      server.route(routes.editor)
      server.route(routes.help)
      server.route(routes.home)
      server.route(routes.library)
      server.route(routes.login)
      server.route(routes.logout)
    }
  }
} as ServerRegisterPluginObject<void>
