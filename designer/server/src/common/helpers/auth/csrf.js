import crumb from '@hapi/crumb'

import config from '~/src/config.js'

/**
 * @type {ServerRegisterPluginObject}
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
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */
