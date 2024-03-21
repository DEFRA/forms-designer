import { type ServerRoute } from '@hapi/hapi'

import config from '~/src/config.js'

export const healthCheckRoute: ServerRoute = {
  method: 'GET',
  path: '/health-check',
  handler: function () {
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
}
