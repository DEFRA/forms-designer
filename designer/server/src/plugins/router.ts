import { type ServerRegisterPluginObject } from '@hapi/hapi'

import routes from '~/src/routes/index.js'

export default {
  plugin: {
    name: 'router',
    register(server) {
      server.route(routes)
    }
  }
} as ServerRegisterPluginObject<void>
