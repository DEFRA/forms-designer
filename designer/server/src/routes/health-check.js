import { uptime } from 'process'

import config from '~/src/config.js'

export default /** @type {ServerRoute} */ ({
  method: 'GET',
  path: '/health-check',
  handler() {
    const date = new Date()
    return {
      status: 'OK',
      lastCommit: config.lastCommit,
      lastTag: config.lastTag,
      time: date.toUTCString(),
      uptime: uptime()
    }
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
