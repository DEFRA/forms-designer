import { type Server } from '@hapi/hapi'
import Wreck from '@hapi/wreck'

import { auth } from '~/test/fixtures/auth.js'

describe('Server API', () => {
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
    persistenceService.getDraftFormDefinition = () => {
      return Promise.resolve([])
    }
    persistenceService.updateDraftFormDefinition = () => {
      return Promise.resolve([])
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test.skip('Failure to communicate with Runner should place error on session', async () => {
    const options = {
      method: 'put',
      url: '/forms-designer/api/test-form-id/data',
      auth,
      payload: {
        metadata: {},
        startPage: '/first-page',
        pages: [
          {
            title: 'First page',
            path: '/first-page',
            components: [],
            next: [
              {
                path: '/summary'
              }
            ]
          },
          {
            title: 'Summary',
            path: '/summary',
            controller: './pages/summary.js',
            components: []
          }
        ],
        lists: [],
        sections: [],
        conditions: [],
        fees: [],
        outputs: [],
        version: 2
      }
    }

    jest.spyOn(Wreck, 'get').mockResolvedValue({
      payload: Buffer.from(JSON.stringify({}))
    })

    const result = await server.inject(options)
    expect(result.statusCode).toBe(401)

    const optionsCrash = {
      method: 'get',
      url: '/forms-designer/error/crashreport/test-form-id',
      auth
    }

    const resultCrash = await server.inject(optionsCrash)
    expect(resultCrash.headers['content-disposition']).toContain(
      'attachment; filename=test-form-id-crash-report'
    )
  })

  test('Schema validation failures should return 401', async () => {
    const options = {
      method: 'put',
      url: '/forms-designer/api/test-form-id/data',
      auth,
      payload: {
        metadata: {},
        startPage: '/first-page',
        pages: [
          {
            title: 'First page',
            path: '/first-page',
            components: [],
            next: [
              {
                path: '/summary'
              }
            ]
          },
          {
            title: 'Summary',
            path: '/summary',
            controller: './pages/summary.js',
            components: []
          }
        ],
        lists: [],
        conditions: [],
        fees: [],
        outputs: [],
        version: 2
      }
    }

    const result = await server.inject<{ err: Error }>(options)
    expect(result.statusCode).toBe(401)
    expect(result.result?.err.message).toMatch('Schema validation failed')
  })

  test('persistence service errors should return 401', async () => {
    // Given
    const { persistenceService } = server.services();
    persistenceService.updateDraftFormDefinition = () => {
      return Promise.reject(new Error('Error in persistence service'))
    }

    const options = {
      method: 'put',
      url: '/forms-designer/api/test-form-id/data',
      auth,
      payload: {
        metadata: {},
        startPage: '/first-page',
        pages: [
          {
            title: 'First page',
            path: '/first-page',
            components: [],
            next: [
              {
                path: '/summary'
              }
            ]
          },
          {
            title: 'Summary',
            path: '/summary',
            controller: './pages/summary.js',
            components: []
          }
        ],
        lists: [],
        sections: [],
        conditions: [],
        fees: [],
        outputs: [],
        version: 2
      }
    }

    // When
    const result = await server.inject<{ err: Error }>(options)

    // Then
    expect(result.statusCode).toBe(401)
    expect(result.result?.err.message).toBe('Error in persistence service')
  })
})
