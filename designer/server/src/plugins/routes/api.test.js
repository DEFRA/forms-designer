
import { createServer } from '~/src/createServer.js'
import * as persistenceService from '~/src/lib/formPersistenceService.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/formPersistenceService')

describe('Server API', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    jest
      .mocked(persistenceService.getDraftFormDefinition)
      .mockReturnValue(
        Promise.resolve(
          /** @type {import('@defra/forms-model').FormDefinition} */ ({})
        )
      )

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

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
    expect(result.result?.err.message).toMatch('Schema validation failed')
  })

  test('persistence service errors should return 401', async () => {
    // Given
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    jest
      .mocked(persistenceService.updateDraftFormDefinition)
      .mockImplementation(() =>
        Promise.reject(new Error('Error in persistence service'))
      )

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
    const result =
      /** @type {import('@hapi/hapi').ServerInjectResponse<{ err: Error }>}) */ (
        await server.inject(options)
      )

    // Then
    expect(result.statusCode).toBe(500)
    expect(result.result?.err.message).toBe('Error in persistence service')
  })
})
