import crumb from '@hapi/crumb'

import config from '~/src/config.js'

const csrf = {
  plugin: {
    name: 'csrf',
    register: async (server) => {
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
