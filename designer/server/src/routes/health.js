import { StatusCodes } from 'http-status-codes'

export default /** @type {ServerRoute} */ ({
  method: 'GET',
  path: '/health',
  handler(_, h) {
    return h.response({ message: 'success' }).code(StatusCodes.OK)
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
