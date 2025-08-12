import { token } from '@hapi/jwt'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getLoginHint } from '~/src/routes/account/auth.js'
import {
  auth,
  authGroupsInvalid,
  authScopesEmpty
} from '~/test/fixtures/auth.js'
import { forms as formMetadataList } from '~/test/fixtures/forms.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/messaging/publish.js')

describe('Authentiation', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe.each([auth, authScopesEmpty, authGroupsInvalid])(
    'With valid or invalid scopes',
    (authIn) => {
      /** @type {ServerInjectResponse} */
      let response

      beforeAll(async () => {
        const options = {
          method: 'get',
          url: '/auth/callback',
          auth: authIn
        }

        response = await server.inject(options)
      })

      it('should redirect to library', () => {
        const { headers } = response
        expect(headers.location).toBe('/library')
      })

      it('should set the user session cookie', () => {
        const { headers } = response
        expect(headers['set-cookie']).toMatchObject(
          expect.arrayContaining([
            expect.stringMatching(/^userSession=[a-z]/i),
            expect.not.stringContaining('userSession=;')
          ])
        )
      })
    }
  )

  it('Should handle stale sessions', async () => {
    jest.mocked(forms.list).mockResolvedValueOnce({
      data: formMetadataList,
      meta: {}
    })

    // log in with session one
    const callbackResponseS1 = await doAuthCallback(server, auth, [])
    const cookiesS1 = callbackResponseS1.headers['set-cookie']
    expect(callbackResponseS1.headers.location).toBe('/library')

    // log in with session two
    // should be allowed, but now S2 is marked as the 'active' session
    const callbackResponseS2 = await doAuthCallback(server, auth, [])
    const cookiesS2 = callbackResponseS2.headers['set-cookie']
    expect(callbackResponseS2.headers.location).toBe('/library')

    // attempt to access a page with session one (now marked as stale)
    // this is invalid - session should not be accepted
    const libraryResponse2S1 = await doCallLibrary(server, cookiesS1)
    expect(libraryResponse2S1.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(libraryResponse2S1.headers.location).toBe('/auth/callback') // invalid sesssion, bump user back to the AAD sign in flow

    const callbackResponseS1b = await doAuthCallback(server, auth, cookiesS1) // follow the callback with session 1 (stale)
    expect(callbackResponseS1b.headers.location).toBe(
      '/auth/sign-out?logoutHint=foo'
    ) // the callback identified the duplicate session, the sign-out route should act upon it

    // attempt to access a page with session two
    // this is valid as it's the active session
    const libraryResponse2S2 = await doCallLibrary(server, cookiesS2)
    expect(libraryResponse2S2.statusCode).toBe(StatusCodes.OK) // this remains the active session, so it should continue
  })
})

describe('getLoginHint', () => {
  it('should return the token', () => {
    const jwt = token.generate({ login_hint: 'foo' }, 'mypass')

    expect(getLoginHint(jwt)).toBe('foo')
  })

  it('should throw an error if the login_hint is missing', () => {
    const jwt = token.generate({}, 'mypass')

    expect(() => getLoginHint(jwt)).toThrow('Missing login_hint in token')
  })

  it('should throw an error if the login_hint is a non-string value', () => {
    const jwt = token.generate({ login_hint: 123 }, 'mypass')

    expect(() => getLoginHint(jwt)).toThrow(
      'login_hint in token is not a string'
    )
  })
})

/**
 * @param {Server<any>} server
 * @param {ServerInjectOptions['auth']} auth
 * @param {string | string[] | undefined} cookies
 */
function doAuthCallback(server, auth, cookies) {
  if (!cookies || typeof cookies === 'string') {
    throw new Error('Invalid cookies')
  }

  const headers = {
    cookie: cookies.join('; ')
  }

  return server.inject({
    method: 'get',
    url: '/auth/callback',
    auth,
    headers
  })
}

/**
 * @param {Server<any>} server
 * @param {string | string[] | undefined} cookies
 */
function doCallLibrary(server, cookies) {
  if (!cookies || typeof cookies === 'string') {
    throw new Error('Invalid cookies')
  }

  const headers = {
    cookie: cookies.join('; ')
  }

  return server.inject({
    method: 'get',
    url: '/library',
    headers
  })
}

/**
 * @import { Server, ServerInjectOptions, ServerInjectResponse } from '@hapi/hapi'
 */
