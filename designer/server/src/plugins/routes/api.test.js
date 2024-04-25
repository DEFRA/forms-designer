import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

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

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockReturnValue(
        Promise.resolve(
          /** @type {import('@defra/forms-model').FormDefinition} */ ({})
        )
      )

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)

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

  test('Schema validation failures should return 500', async () => {
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

    const result = /** @type {ServerInjectResponse<{ err: Error }>}) */ (
      await server.inject(options)
    )

    expect(result.statusCode).toBe(500)
    expect(result.result?.err.message).toMatch('Schema validation failed')
  })

  test('persistence service errors should return 500', async () => {
    // Given
    jest
      .mocked(forms.updateDraftFormDefinition)
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
    const result = /** @type {ServerInjectResponse<{ err: Error }>}) */ (
      await server.inject(options)
    )

    // Then
    expect(result.statusCode).toBe(500)
    expect(result.result?.err.message).toBe('Error in persistence service')
  })
})

/**
 * @template {object} Result
 * @typedef {import('@hapi/hapi').ServerInjectResponse<Result>} ServerInjectResponse
 */
