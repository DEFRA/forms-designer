import { type ServerRegisterPluginObject, type ServerRoute } from '@hapi/hapi'

import routes from '~/src/routes/index.js'

export default {
  plugin: {
    name: 'router',
    register(server) {
      server.route(routes as ServerRoute[])
    }
  }
} as ServerRegisterPluginObject<void>
