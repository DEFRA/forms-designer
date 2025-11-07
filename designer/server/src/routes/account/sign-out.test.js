import { hostname } from 'node:os'

import { StatusCodes } from 'http-status-codes'

import {
  hasCredentials,
  hasUser
} from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as oidc from '~/src/lib/oidc.js'
import { getLoginHint } from '~/src/routes/account/auth.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/common/helpers/auth/drop-user-session.js')
jest.mock('~/src/common/helpers/auth/get-user-session.js')
jest.mock('~/src/routes/account/auth.js')
jest.mock('~/src/lib/oidc.js')
jest.mock('~/src/messaging/publish.js')

describe('signOutRoute', () => {
  /** @type {Server} */
  let server

  const wellKnownConfiguration = {
    token_endpoint: 'https://example.com/token',
    authorization_endpoint: 'https://example.com/auth',
    end_session_endpoint: 'https://example.com/end-session'
  }

  beforeEach(async () => {
    jest
      .mocked(oidc.getWellKnownConfiguration)
      // @ts-expect-error we don't need a rich mock for this
      .mockResolvedValueOnce(wellKnownConfiguration)

    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  it('should redirect to home if credentials are not found', async () => {
    jest.mocked(hasCredentials).mockReturnValueOnce(false)

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.headers.location).toBe('/')
  })

  it("should redirect to home if not authenticated and the logoutHint isn't provided", async () => {
    jest.mocked(hasUser).mockReturnValueOnce(false)
    config.isTest = false

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.headers.location).toBe('/')
  })

  it("should redirect to home if in test mode and the logoutHint isn't provided", async () => {
    jest.mocked(hasUser).mockReturnValueOnce(true)
    config.isTest = true

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.headers.location).toBe('/')
  })

  it('should redirect to end session URL if authenticated and the logoutHint is provided', async () => {
    jest.mocked(hasUser).mockReturnValueOnce(true)
    config.isTest = false

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out?logoutHint=bar',
      auth
    })

    expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(response.headers.location).toBe(
      `${wellKnownConfiguration.end_session_endpoint}?post_logout_redirect_uri=http%3A%2F%2F${hostname().toLowerCase()}%3A3000%2Faccount%2Fsigned-out&logout_hint=bar` // foo is from the query params
    )
  })

  it('should redirect to end session URL if authenticated and the logoutHint is not provided', async () => {
    jest.mocked(hasUser).mockReturnValueOnce(true)
    jest.mocked(getLoginHint).mockReturnValueOnce('foo')
    config.isTest = false

    const response = await server.inject({
      method: 'GET',
      url: '/auth/sign-out',
      auth
    })

    expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(response.headers.location).toBe(
      `${wellKnownConfiguration.end_session_endpoint}?post_logout_redirect_uri=http%3A%2F%2F${hostname().toLowerCase()}%3A3000%2Faccount%2Fsigned-out&logout_hint=foo` // bar is from the credentials
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
