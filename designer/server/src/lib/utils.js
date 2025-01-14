import { getTraceId } from '@defra/hapi-tracing'

import config from '~/src/config.js'

/**
 * Returns a set of headers to use in a http request`
 * @param {string} token
 * @returns {Parameters<typeof Wreck.request>[2]}
 */
export function getHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(getTraceId() ? { [config.tracing.header]: getTraceId() } : {})
    }
  }
}

/**
 * @import Wreck from '@hapi/wreck'
 */
