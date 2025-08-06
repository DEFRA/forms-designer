import {
  getUserClaims,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'

jest.mock('~/src/common/helpers/auth/get-user-session.js')

const mockSession = {
  set: jest.fn(),
  get: jest.fn().mockReturnValue('123-123')
}

const mockRequest =
  // @ts-expect-error - typing not required for testing
  /** @type {Request<{ AuthArtifactsExtra: AuthArtifacts }>} */ ({
    auth: {
      credentials: {},
      artifacts: {
        access_token: "{ name: 'my-name'}",
        id_token: 'id_token',
        refresh_token: 'refresh_token'
      }
    },
    server: {
      methods: {
        session: mockSession
      }
    }
  })

describe('user-session', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUserSession', () => {
    test('should throw if missing credentials', async () => {
      jest.mocked(hasAuthenticated).mockReturnValueOnce(false)
      await expect(() => createUserSession(mockRequest)).rejects.toThrow(
        'Missing user authentication tokens'
      )
    })

    test('should return user id', async () => {
      jest.mocked(hasAuthenticated).mockReturnValueOnce(true)
      jest.mocked(getUserClaims).mockReturnValue({
        // @ts-expect-error - typing not required for testing
        token: {
          id: '123-123',
          name: 'John Smith',
          family_name: 'Smith',
          given_name: 'John',
          iat: 10000000,
          exp: 600000
        }
      })
      const res = await createUserSession(mockRequest)
      expect(res).toBe('123-123')
    })
  })
})

/**
 * @import { AuthArtifacts, Request } from '@hapi/hapi'
 */
