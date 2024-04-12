import { join, resolve } from 'node:path'

import config from '~/src/config.js'

/**
 * @type {ServerRoute[]}
 */
export default [
  {
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
  },
  {
    method: 'GET',
    path: '/robots.txt',
    options: {
      auth: false,
      handler: {
        file: 'server/public/static/robots.txt'
      }
    }
  },
  {
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
  },
  {
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
  },
  {
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
  }
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
