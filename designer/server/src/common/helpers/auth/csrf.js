import crumb from '@hapi/crumb'

import config from '~/src/config.js'

/**
 * @type {ServerRegisterPluginObject<void>}
 */
const csrf = {
  plugin: {
    name: 'csrf',
    async register(server) {
      await server.register({
        plugin: crumb,
        options: {
          key: 'csrfToken',
          cookieOptions: {
            path: '/',
            password: config.sessionCookiePassword,
            isSecure: config.isProduction,
            ttl: config.sessionCookieTtl
          }
        }
      })
    }
  }
}

export { csrf }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
