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
          logUnauthorized: true,
          enforce: config.enforceCsrf,
          cookieOptions: {
            path: '/',
            password: config.sessionCookiePassword,
            isSecure: config.isSecure,
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
