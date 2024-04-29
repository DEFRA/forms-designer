import { join } from 'node:path'

import config from '~/src/config.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/health-check',
    handler() {
      const date = new Date()
      const uptime = process.uptime()
      return {
        status: 'OK',
        lastCommit: config.lastCommit,
        lastTag: config.lastTag,
        time: date.toUTCString(),
        uptime
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/robots.txt',
    options: {
      auth: false,
      handler: {
        file: 'server/public/static/robots.txt'
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
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
