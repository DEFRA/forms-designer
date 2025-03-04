import { StatusCodes } from 'http-status-codes'

import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as oidc from '~/src/lib/oidc.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/common/helpers/auth/drop-user-session.js')
jest.mock('~/src/common/helpers/auth/get-user-session.js')
jest.mock('~/src/lib/oidc.js')

describe('signOutRoute', () => {
  /** @type {Server} */
  let server

  const wellKnownConfiguration = {
    token_endpoint: 'https://example.com/token',
    authorization_endpoint: 'https://example.com/auth',
    end_session_endpoint: 'https://example.com/end-session'
  }

  beforeAll(async () => {
    jest
      .mocked(oidc.getWellKnownConfiguration)
      // @ts-expect-error we don't need a rich mock for this
      .mockResolvedValueOnce(wellKnownConfiguration)

    server = await createServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('should redirect to home if not authenticated and force is false', async () => {
    jest.mocked(hasUser).mockReturnValueOnce(false)
    config.isTest = false

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.headers.location).toBe('/')
  })

  it('should redirect to home if in test mode and force is false', async () => {
    jest.mocked(hasUser).mockReturnValueOnce(true)
    config.isTest = true

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.headers.location).toBe('/')
  })

  it('should redirect to end session URL if authenticated and force is true', async () => {
    jest.mocked(hasUser).mockReturnValueOnce(true)

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out?force=true',
      auth
    })

    expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(response.headers.location).toBe(
      `${wellKnownConfiguration.end_session_endpoint}?client_id=dummy&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Faccount%2Fsigned-out`
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
