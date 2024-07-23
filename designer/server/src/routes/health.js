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
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
