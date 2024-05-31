import { afterEach, describe, expect, test } from '@jest/globals'

import { auth } from '~/test/fixtures/auth.js'

describe('Health check route', () => {
  const startServer = async () => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  /** @type {import('@hapi/hapi').Server} */
  let server

  afterEach(async () => {
    await server.stop()
  })

  test('/health route response is correct', async () => {
    server = await startServer()

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
