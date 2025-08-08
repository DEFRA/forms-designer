import {
  getUserClaims,
  getUserScopes,
  hasAuthenticated
} from '~/src/common/helpers/auth/get-user-session.js'
import { createUserSession } from '~/src/common/helpers/auth/user-session.js'
import config from '~/src/config.js'
import { getUser } from '~/src/lib/manage.js'

jest.mock('~/src/common/helpers/auth/get-user-session.js')
jest.mock('~/src/config.ts')
jest.mock('~/src/lib/manage.js')

const mockSession = {
  set: jest.fn(),
  get: jest.fn().mockReturnValue('123-123')
}

const mockEntitlementUser = /** @type {EntitlementUser} */ ({
  userId: 'userId123',
  roles: ['admin'],
  scopes: ['scope1', 'scope2']
})

// @ts-expect-error - typing not required for testing
const mockUserClaims = /** @type {Record<keyof Tokens, UserProfile>} */ ({
  token: {
    id: '123-123',
    oid: '123-123',
    name: 'John Smith',
    family_name: 'Smith',
    given_name: 'John',
    iat: 10000000,
    exp: 600000
  }
})

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
    jest.mocked(config).featureFlagUseEntitlementApi = false
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
      jest.mocked(getUserClaims).mockReturnValue(mockUserClaims)
      const res = await createUserSession(mockRequest)
      expect(res).toBe('123-123')
      expect(getUser).not.toHaveBeenCalled()
    })

    test('should add roles/scopes from entitlement api if enabled', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = true
      jest.mocked(hasAuthenticated).mockReturnValueOnce(true)
      jest.mocked(getUserClaims).mockReturnValue(mockUserClaims)
      jest.mocked(getUser).mockResolvedValueOnce(mockEntitlementUser)
      const res = await createUserSession(mockRequest)
      expect(res).toBe('123-123')
      expect(getUser).toHaveBeenCalled()
      expect(mockRequest.server.methods.session.set).toHaveBeenCalledWith(
        '123-123',
        {
          expiresIn: undefined,
          flowId: expect.any(String),
          idToken: 'id_token',
          refreshToken: 'refresh_token',
          scope: [
            'form-delete',
            'form-edit',
            'form-read',
            'form-publish',
            'user-create',
            'user-delete',
            'user-edit'
          ],
          token: "{ name: 'my-name'}",
          user: {
            displayName: 'John Smith',
            email: '',
            expiresAt: expect.any(String),
            id: '123-123',
            issuedAt: expect.any(String),
            roles: ['admin']
          }
        }
      )
    })

    test('should fallback if error in entitlement api', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = true
      jest.mocked(hasAuthenticated).mockReturnValueOnce(true)
      jest.mocked(getUserClaims).mockReturnValue(mockUserClaims)
      jest.mocked(getUser).mockImplementationOnce(() => {
        throw new Error('entitlement api error')
      })
      jest.mocked(getUserScopes).mockReturnValueOnce(['form-read', 'form-edit'])
      const res = await createUserSession(mockRequest)
      expect(res).toBe('123-123')
      expect(getUser).toHaveBeenCalled()
      expect(mockRequest.server.methods.session.set).toHaveBeenCalledWith(
        '123-123',
        {
          expiresIn: undefined,
          flowId: expect.any(String),
          idToken: 'id_token',
          refreshToken: 'refresh_token',
          scope: ['form-read', 'form-edit'],
          token: "{ name: 'my-name'}",
          user: {
            displayName: 'John Smith',
            email: '',
            expiresAt: expect.any(String),
            id: '123-123',
            issuedAt: expect.any(String),
            roles: []
          }
        }
      )
    })
  })
})

/**
 * @import { AuthArtifacts, Request } from '@hapi/hapi'
 * @import { EntitlementUser } from '@defra/forms-model'
 * @import { Tokens, UserProfile } from '~/src/common/helpers/auth/types.js'
 */
