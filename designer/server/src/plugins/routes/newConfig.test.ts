import { type Server } from '@hapi/hapi'

import { publish } from '~/src/lib/publish/index.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/publish')

describe('NewConfig tests', () => {
  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
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
    persistenceService.getConfiguration = () => {
      return Promise.resolve([])
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('POST /api/new with special characters result in bad request', async () => {
    const options = {
      method: 'post',
      url: '/forms-designer/api/new',
      auth,
      payload: {
        name: 'A *& B',
        selected: { Key: 'New' }
      }
    }

    jest.mocked(publish).mockImplementation(() => Promise.resolve([]))
    const res = await server.inject(options)

    expect(res.statusCode).toBe(400)
    expect(res.result).toContain(
      'Form name should not contain special characters'
    )
  })

  test('POST /api/new with existing form should not result in bad request', async () => {
    const options = {
      method: 'post',
      url: '/forms-designer/api/new',
      auth,
      payload: {
        name: '',
        selected: { Key: 'Test' }
      }
    }

    jest.mocked(publish).mockImplementation(() => Promise.resolve([]))
    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
  })

  test("POST /api/new with '-' should not result in bad request", async () => {
    const options = {
      method: 'post',
      url: '/forms-designer/api/new',
      auth,
      payload: {
        name: 'a-b',
        selected: { Key: 'New' }
      }
    }

    jest.mocked(publish).mockImplementation(() => Promise.resolve([]))
    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
  })

  test('POST /api/new without runner running should result in bad request', async () => {
    const options = {
      method: 'post',
      url: '/forms-designer/api/new',
      auth,
      payload: {
        name: 'a-b',
        selected: { Key: 'New' }
      }
    }

    jest.mocked(publish).mockImplementation(() => Promise.reject())
    const res = await server.inject(options)

    expect(res.statusCode).toBe(401)
    expect(res.result).toMatch('Designer could not connect to runner instance.')
  })
})
