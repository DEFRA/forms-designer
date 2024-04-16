import { type ServerRegisterPluginObject } from '@hapi/hapi'
import { envStore, flagg } from 'flagg'

import pkg from '../../../package.json' with { type: 'json' }

import { api, app } from '~/src/plugins/routes/index.js'

export const designerPlugin = {
  plugin: {
    name: pkg.name,
    version: pkg.version,
    multiple: true,
    dependencies: '@hapi/vision',
    register(server) {
      server.route(app.getApp)

      server.route(app.getAppChildRoutes)

      server.route(app.getErrorCrashReport)

      server.route({
        method: 'GET',
        path: '/feature-toggles',
        options: {
          handler(request, h) {
            const featureFlags = flagg({
              store: envStore(process.env),
              definitions: {
                featureEditPageDuplicateButton: { default: false }
              }
            })

            return h
              .response(JSON.stringify(featureFlags.getAllResolved()))
              .code(200)
          }
        }
      })

      server.route(api.getFormWithId)
      server.route(api.putFormWithId)
      server.route(api.getAllPersistedConfigurations)
      server.route(api.log)
    }
  }
} as ServerRegisterPluginObject<void>
