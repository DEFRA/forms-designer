import { type Server } from '@hapi/hapi'
import { DateTime } from 'luxon'

import { auth } from '~/test/fixtures/auth.js'

describe('/health-check Route', () => {
  const OLD_ENV = { ...process.env }

  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server: Server

  afterAll(async () => {
    process.env = OLD_ENV
    await server.stop()
  })

  test('/health-check route response is correct', async () => {
    process.env.LAST_COMMIT = 'LAST COMMIT'
    process.env.LAST_TAG = 'LAST TAG'

    server = await startServer()

    const options = {
      method: 'GET',
      url: '/forms-designer/health-check',
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
