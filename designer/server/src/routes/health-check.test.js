import { auth } from '~/test/fixtures/auth.js'

describe('Health check route', () => {
  const OLD_ENV = { ...process.env }

  const startServer = async () => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  /** @type {import('@hapi/hapi').Server} */
  let server

  afterEach(async () => {
    process.env = OLD_ENV
    await server.stop()
  })

  test('/health-check route response is correct', async () => {
    process.env.LAST_COMMIT = 'LAST COMMIT'
    process.env.LAST_TAG = 'LAST TAG'

    server = await startServer()

    const options = {
      method: 'GET',
      url: '/health-check',
      auth
    }

    const { result } = await server.inject(options)

    expect(result).toMatchObject({
      status: 'OK',
      lastCommit: 'LAST COMMIT',
      lastTag: 'LAST TAG',
      time: expect.any(String)
    })
  })
})
