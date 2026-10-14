import Boom from '@hapi/boom'
import { Server } from '@hapi/hapi'
import { StatusCodes } from 'http-status-codes'

import errorPages from '~/src/plugins/error-pages/index.js'

describe('error-pages plugin', () => {
  /** @type {Server} */
  let server: Server
  let mockLogger: { info: jest.Mock; error: jest.Mock }

  async function buildServer(response: () => never) {
    server = new Server()
    mockLogger = { info: jest.fn(), error: jest.fn() }

    server.ext('onRequest', (request, h) => {
      // Stand in for the `request.logger` decoration hapi-pino provides
      Object.defineProperty(request, 'logger', {
        value: mockLogger,
        configurable: true
      })
      return h.continue
    })

    // Stand in for the `h.view` decoration @hapi/vision provides
    server.decorate('toolkit', 'view', function (template: string) {
      return this.response({ template })
    })

    await server.register(errorPages)

    server.route({
      method: 'GET',
      path: '/test',
      handler: response
    })

    await server.initialize()
  }

  afterEach(async () => {
    await server.stop()
  })

  it('logs an info message (not an error) for a 403 Insufficient scope response', async () => {
    await buildServer(() => {
      throw Boom.forbidden('Insufficient scope')
    })

    const response = await server.inject('/test')

    expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Insufficient scope')
    )
  })

  it('logs an info message (not an error) for a 400 Bad Request response', async () => {
    await buildServer(() => {
      throw Boom.badRequest('No files associated with this submission')
    })

    const response = await server.inject('/test')

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('No files associated with this submission')
    )
  })

  it('logs an error for a 500 response', async () => {
    await buildServer(() => {
      throw Boom.internal('Something broke')
    })

    const response = await server.inject('/test')

    expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.anything(),
      'Unhandled error found'
    )
    expect(mockLogger.info).not.toHaveBeenCalled()
  })

  it('logs an info message (not an error) for a 404 response', async () => {
    await buildServer(() => {
      throw Boom.notFound()
    })

    const response = await server.inject('/test')

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('[notFound]')
    )
  })
})
