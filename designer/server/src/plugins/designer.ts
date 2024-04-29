import { type ServerRegisterPluginObject } from '@hapi/hapi'

import pkg from '../../../package.json' with { type: 'json' }

import { api, app } from '~/src/plugins/routes/index.js'

export const designerPlugin = {
  plugin: {
    name: pkg.name,
    version: pkg.version,
    multiple: true,
    dependencies: '@hapi/vision',
    register(server) {
      server.route(app.getAppChildRoutes)
      server.route(api.getFormWithId)
      server.route(api.putFormWithId)
      server.route(api.log)
    }
  }
} as ServerRegisterPluginObject<void>
