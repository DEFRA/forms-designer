import { type Server } from '@hapi/hapi'

import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'

describe('App routes test', () => {
  const startServer = async (): Promise<Server> => {
    const server = await createServer()
    await server.start()
    return server
  }

  let server: Server

  beforeAll(async () => {
    server = await startServer()
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }
    persistenceService.copyConfiguration = () => {
      return Promise.resolve([])
    }
    persistenceService.uploadConfiguration = () => {
      return Promise.resolve([])
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('GET /app should serve designer landing page', async () => {
    const options = {
      method: 'get',
      url: '/app',
      auth
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(res.result).toContain('<main id="root">')
  })

  test('GET /app/* should serve designer landing page', async () => {
    const options = {
      method: 'get',
      url: '/app/designer/test',
      auth
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(res.result).toContain('<main id="root">')
  })
})
