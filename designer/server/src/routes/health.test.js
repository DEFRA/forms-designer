import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'

describe('Health check route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('/health route response is correct', async () => {
    const options = {
      method: 'GET',
      url: '/health',
      auth
    }

    const { result } = await server.inject(options)

    expect(result).toMatchObject({
      message: 'success'
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
