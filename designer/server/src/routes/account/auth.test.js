import { createServer } from '~/src/createServer.js'
import {
  auth,
  authScopesEmpty,
  authGroupsInvalid
} from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

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
})

/**
 * @import { Server, ServerInjectResponse } from '@hapi/hapi'
 */
