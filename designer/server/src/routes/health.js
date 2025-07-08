import { StatusCodes } from 'http-status-codes'

export default /** @type {ServerRoute} */ ({
  method: 'GET',
  path: '/health',
  handler(request, h) {
    const { error } = request.query

    if (error === 'test') {
      throw new Error('Test error for stack trace logging')
    }

    if (error === 'reference') {
      // @ts-expect-error someUndefinedVariable is not defined
      // eslint-disable-next-line no-undef
      return someUndefinedVariable.property
    }

    if (error === 'type') {
      const nullValue = null
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return nullValue.toString()
    }

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
