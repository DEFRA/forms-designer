import { mapScopesToRoles } from '@defra/forms-model'

import {
  dropUserSessionById,
  refreshUserSessionEntitlements
} from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
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

  const token = 'test-token'
  const userId = 'user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('refreshUserSessionEntitlements', () => {
    it('should do nothing if no session exists', async () => {
      mockSession.get.mockResolvedValue(null)

      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).not.toHaveBeenCalled()
      expect(mockSession.set).not.toHaveBeenCalled()
    })

    it('should refresh user session with new entitlements', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: ['form-creator']
        },
        scope: ['form-read', 'form-edit'],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: ['admin'],
        scopes: []
      }

      const newScopes = [
        'form-delete',
        'form-edit',
        'form-read',
        'form-publish',
        'user-create',
        'user-delete',
        'user-edit'
      ]

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(newScopes)

      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(mapScopesToRoles)).toHaveBeenCalledWith(['admin'])
      expect(existingSession.user.roles).toEqual(['admin'])
      expect(existingSession.scope).toEqual(newScopes)
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should handle empty roles array', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: ['admin']
        },
        scope: ['form-read', 'form-edit'],
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

      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(existingSession.user.roles).toEqual([])
      expect(existingSession.scope).toEqual([])
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should handle session with no user object', async () => {
      const existingSession = {
        scope: ['form-read', 'form-edit'],
        token: 'old-token'
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: ['admin'],
        scopes: []
      }

      const newScopes = ['admin-scope']

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(newScopes)

      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(existingSession.scope).toEqual(newScopes)
      expect(mockSession.set).toHaveBeenCalledWith(userId, existingSession)
    })

    it('should drop session if user not found in entitlement API', async () => {
      const existingSession = {
        user: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          roles: ['form-creator']
        },
        scope: ['form-read', 'form-edit'],
        token: 'old-token'
      }

      const apiError = new Error('User not found')

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockRejectedValue(apiError)

      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(mockSession.get).toHaveBeenCalledWith(userId)
      expect(jest.mocked(getUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(mockSession.set).not.toHaveBeenCalled()
    })

    it('should throw error if session.get fails', async () => {
      const sessionError = new Error('Redis connection failed')
      mockSession.get.mockRejectedValue(sessionError)

      await expect(
        refreshUserSessionEntitlements(mockServer, userId, token)
      ).rejects.toThrow('Redis connection failed')
    })

    it('should drop session if session.set fails', async () => {
      const existingSession = {
        user: {
          id: userId,
          roles: ['form-creator']
        },
        scope: ['form-read']
      }

      const updatedUser = {
        userId,
        email: 'test@example.com',
        displayName: 'Test User',
        roles: ['admin'],
        scopes: []
      }

      const sessionError = new Error('Redis write failed')

      mockSession.get.mockResolvedValue(existingSession)
      jest.mocked(getUser).mockResolvedValue(updatedUser)
      jest.mocked(mapScopesToRoles).mockReturnValue(['admin-scope'])
      mockSession.set.mockRejectedValue(sessionError)

      // When session.set fails, it should catch the error and drop the session
      await refreshUserSessionEntitlements(mockServer, userId, token)

      expect(mockSession.drop).toHaveBeenCalledWith(userId)
    })
  })

  describe('dropUserSessionById', () => {
    it('should drop user session successfully', async () => {
      mockSession.drop.mockResolvedValue(undefined)

      await dropUserSessionById(mockServer, userId)

      expect(mockSession.drop).toHaveBeenCalledWith(userId)
    })

    it('should log error but not throw if drop fails', async () => {
      const error = new Error('Redis error')
      mockSession.drop.mockRejectedValue(error)

      // Should not throw even if drop fails
      await expect(
        dropUserSessionById(mockServer, userId)
      ).resolves.toBeUndefined()

      expect(mockSession.drop).toHaveBeenCalledWith(userId)
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
