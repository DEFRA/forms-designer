import { Roles, Scopes, mapScopesToRoles } from '@defra/forms-model'

import { refreshUserSessionEntitlements } from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
import { getUser } from '~/src/lib/manage.js'

jest.mock('@defra/forms-model')
jest.mock('~/src/lib/manage.js')

describe('refresh-user-session-entitlements', () => {
  const mockSession = {
    get: jest.fn(),
    set: jest.fn(),
    drop: jest.fn()
  }

  const mockServer = /** @type {Server} */ (
    /** @type {unknown} */ ({
      methods: {
        session: mockSession
      }
    })
  )

  const mockRequest = /** @type {Request} */ (
    /** @type {unknown} */ ({
      server: mockServer,
      auth: {
        credentials: {
          user: {
            id: 'user-123',
            roles: [Roles.FormCreator]
          },
          scope: [Scopes.FormRead, Scopes.FormEdit]
        }
      }
    })
  )

  const token = 'test-token'
  const userId = 'user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('refreshUserSessionEntitlements', () => {
    it('should do nothing if no session exists', async () => {
      mockSession.get.mockResolvedValue(null)

      const result = await refreshUserSessionEntitlements(
        mockRequest,
        userId,
        token
      )

      expect(result).toBeUndefined()
      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).not.toHaveBeenCalled()
      expect(mockSession.set).not.toHaveBeenCalled()
    })

    it('should refresh user session with new entitlements using server', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: [Roles.FormCreator]
        },
        scope: [Scopes.FormRead, Scopes.FormEdit],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [Roles.Admin],
        scopes: []
      }

      const newScopes = [
        Scopes.FormDelete,
        Scopes.FormEdit,
        Scopes.FormRead,
        Scopes.FormPublish,
        Scopes.UserCreate,
        Scopes.UserDelete,
        Scopes.UserEdit
      ]

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(newScopes)

      const result = await refreshUserSessionEntitlements(
        mockRequest,
        userId,
        token
      )

      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(mapScopesToRoles)).toHaveBeenCalledWith([Roles.Admin])
      expect(existingSession.user.roles).toEqual([Roles.Admin])
      expect(existingSession.scope).toEqual(newScopes)
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
      expect(result).toEqual(newScopes)
    })

    it('should patch request credentials when updating current user', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: [Roles.FormCreator]
        },
        scope: [Scopes.FormRead, Scopes.FormEdit],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [Roles.Admin],
        scopes: []
      }

      const newScopes = [Scopes.FormEdit]

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(newScopes)

      await refreshUserSessionEntitlements(mockRequest, userId, token)

      expect(mockRequest.auth.credentials.scope).toEqual(newScopes)
      expect(mockRequest.auth.credentials.user?.roles).toEqual([Roles.Admin])
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should handle empty roles array', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: [Roles.Admin]
        },
        scope: [Scopes.FormRead, Scopes.FormEdit],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [],
        scopes: []
      }

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)

      await refreshUserSessionEntitlements(mockRequest, userId, token)

      expect(existingSession.user.roles).toEqual([])
      expect(existingSession.scope).toEqual([])
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should handle session with no user object', async () => {
      const existingSession = {
        scope: [Scopes.FormRead, Scopes.FormEdit],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [Roles.Admin],
        scopes: []
      }

      const newScopes = [Scopes.FormEdit]

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(newScopes)

      await refreshUserSessionEntitlements(mockRequest, userId, token)

      expect(existingSession.scope).toEqual(newScopes)
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should drop session and throw if user not found in entitlement API', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: [Roles.FormCreator]
        },
        scope: [Scopes.FormRead, Scopes.FormEdit],
        token: 'old-token'
      }

      const apiError = new Error('User not found')

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockRejectedValue(apiError)

      await expect(
        refreshUserSessionEntitlements(mockRequest, userId, token)
      ).rejects.toThrow('User not found')

      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(mockSession.set).not.toHaveBeenCalled()
    })

    it('should throw error if session.get fails', async () => {
      const sessionError = new Error('Redis connection failed')
      mockSession.get.mockRejectedValue(sessionError)

      await expect(
        refreshUserSessionEntitlements(mockRequest, userId, token)
      ).rejects.toThrow('Redis connection failed')
    })

    it('should throw error if session.set fails', async () => {
      const existingSession = {
        user: {
          id: userId,
          roles: [Roles.FormCreator]
        },
        scope: [Scopes.FormRead]
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [Roles.Admin],
        scopes: []
      }

      const sessionError = new Error('Redis write failed')

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue([Scopes.FormEdit])
      mockSession.set.mockRejectedValue(sessionError)

      // When session.set fails, it should throw the error
      await expect(
        refreshUserSessionEntitlements(mockRequest, userId, token)
      ).rejects.toThrow('Redis write failed')
    })

    it('should not patch credentials for different user', async () => {
      const otherUserId = 'other-user-456'
      const existingSession = {
        user: {
          id: otherUserId,
          roles: [Roles.FormCreator]
        },
        scope: [Scopes.FormRead]
      }

      const updatedUser = {
        userId: otherUserId,
        email: 'other@example.com',
        displayName: 'Other User',
        roles: [Roles.Admin],
        scopes: []
      }

      const originalScope = mockRequest.auth.credentials.scope
        ? [...mockRequest.auth.credentials.scope]
        : []
      const originalRoles = mockRequest.auth.credentials.user?.roles
        ? [...mockRequest.auth.credentials.user.roles]
        : []

      // Reset mockSession.set to resolve successfully
      mockSession.set.mockResolvedValue(undefined)
      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue([Scopes.FormEdit])

      await refreshUserSessionEntitlements(mockRequest, otherUserId, token)

      // Should NOT patch the current request's credentials
      expect(mockRequest.auth.credentials.scope).toEqual(originalScope)
      expect(mockRequest.auth.credentials.user?.roles).toEqual(originalRoles)
      // Should still update the session
      expect(mockSession.set).toHaveBeenCalledWith(otherUserId, existingSession)
    })
  })
})

/**
 * @import { Server, Request } from '@hapi/hapi'
 */
