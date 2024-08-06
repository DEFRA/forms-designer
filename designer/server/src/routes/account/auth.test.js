import { createServer } from '~/src/createServer.js'
import {
  auth,
  authScopesEmpty,
  authGroupsInvalid
} from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

describe('Authentiation', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const testingScopes = [auth, authScopesEmpty, authGroupsInvalid]

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe.each(testingScopes)('With valid or invalid scopes', (auth) => {
    /** @type {ServerInjectResponse} */
    let response

    beforeAll(async () => {
      const options = {
        method: 'get',
        url: '/auth/callback',
        auth
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
  })
})

/**
 * @template {object} [Result={}]
 * @typedef {import('@hapi/hapi').ServerInjectResponse<Result>} ServerInjectResponse
 */
