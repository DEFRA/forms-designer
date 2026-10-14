import { join } from 'node:path'

import config from '~/src/config.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/robots.txt',
    options: {
      auth: false,
      handler: {
        file: join(config.appDir, 'public', 'static', 'robots.txt')
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/javascripts/{path*}',
    options: {
      auth: false,
      handler: {
        directory: {
          path: join(config.clientDir, 'javascripts')
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/stylesheets/{path*}',
    options: {
      auth: false,
      handler: {
        directory: {
          path: join(config.clientDir, 'stylesheets')
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      auth: false,
      handler: {
        directory: {
          path: join(config.clientDir, 'assets')
        }
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
