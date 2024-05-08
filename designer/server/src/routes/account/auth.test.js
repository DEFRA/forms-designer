import setCookieParser from 'set-cookie-parser'

import { createServer } from '~/src/createServer.js'
import { auth, authNoScopes } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

describe('Auth test', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  afterEach(async () => {
    await server.stop()
  })

  const startServer = async () => {
    const server = await createServer()
    await server.initialize()
    return server
  }

  test('Auth checks should reject user if no scopes present and redirect to home', async () => {
    server = await startServer()

    const options = {
      method: 'get',
      url: '/auth/callback',
      auth: authNoScopes
    }

    const result = await server.inject(options)

    const cookies = setCookieParser.parse(result.headers['set-cookie'] ?? [], {
      map: true
    })

    expect(
      /** @type {CookieAuthResponse} */ (cookies).userSession?.value
    ).toBeFalsy()
    expect(result.headers.location).toBe('/')
  })

  test('Auth checks should accept user if scopes present and redirect to library', async () => {
    server = await startServer()

    const options = {
      method: 'get',
      url: '/auth/callback',
      auth
    }

    const result = await server.inject(options)

    const cookies = setCookieParser.parse(result.headers['set-cookie'] ?? [], {
      map: true
    })

    expect(
      /** @type {CookieAuthResponse} */ (cookies).userSession?.value
    ).toBeTruthy()
    expect(result.headers.location).toBe('/library')
  })
})

/**
 * @template {object} Result
 * @typedef {import('@hapi/hapi').ServerInjectResponse<Result>} ServerInjectResponse
 */

/**
 * Represents the response object for cookie-based authentication.
 * @typedef {object} CookieAuthResponse
 * @property {{ value: string }} [userSession] - The value of the user session cookie.
 */
