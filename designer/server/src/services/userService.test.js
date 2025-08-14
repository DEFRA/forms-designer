import { refreshUserSessionEntitlements } from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
import * as lib from '~/src/lib/manage.js'
import { addUser, deleteUser, updateUser } from '~/src/services/userService.js'

jest.mock('~/src/lib/manage.js')
jest.mock('~/src/common/helpers/auth/refresh-user-session-entitlements.js')

describe('userService', () => {
  const mockSession = {
    get: jest.fn(),
    set: jest.fn(),
    drop: jest.fn()
  }

  const mockCookieAuth = {
    clear: jest.fn()
  }

  const mockRequest = /** @type {Request} */ (
    /** @type {unknown} */ ({
      server: {
        methods: {
          session: mockSession
        },
        auth: {
          verify: jest.fn()
        }
      },
      auth: {
        credentials: {
          token: 'test-token-123',
          user: {
            id: 'current-user',
            email: 'current@example.com'
          }
        }
      },
      cookieAuth: mockCookieAuth
    })
  )

  const token = 'test-token-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addUser', () => {
    it('should add a new user successfully', async () => {
      const userDetails = {
        email: 'newuser@example.com',
        roles: ['form-creator']
      }

      const expectedUser = {
        emailAddress: 'newuser@example.com',
        userRole: 'form-creator',
        displayName: 'New User'
      }

      jest.mocked(lib.addUser).mockResolvedValue(expectedUser)

      const result = await addUser(token, userDetails)

      expect(jest.mocked(lib.addUser)).toHaveBeenCalledWith(token, userDetails)
      expect(result).toEqual(expectedUser)
    })

    it('should handle admin role when adding user', async () => {
      const userDetails = {
        email: 'admin@example.com',
        roles: ['admin']
      }

      const expectedUser = {
        emailAddress: 'admin@example.com',
        userRole: 'admin',
        displayName: 'Admin User'
      }

      jest.mocked(lib.addUser).mockResolvedValue(expectedUser)

      const result = await addUser(token, userDetails)

      expect(jest.mocked(lib.addUser)).toHaveBeenCalledWith(token, userDetails)
      expect(result).toEqual(expectedUser)
    })

    it('should throw error if addUser fails', async () => {
      const userDetails = {
        email: 'test@example.com',
        roles: ['form-creator']
      }

      const error = new Error('Failed to add user')
      jest.mocked(lib.addUser).mockRejectedValue(error)

      await expect(addUser(token, userDetails)).rejects.toThrow(
        'Failed to add user'
      )

      expect(jest.mocked(lib.addUser)).toHaveBeenCalledWith(token, userDetails)
    })
  })

  describe('updateUser', () => {
    it('should update user and refresh session entitlements', async () => {
      const userDetails = {
        userId: 'user-123',
        roles: ['admin']
      }

      const expectedUser = {
        userId: 'user-123',
        userRole: 'admin'
      }

      jest.mocked(lib.updateUser).mockResolvedValue(expectedUser)
      jest.mocked(refreshUserSessionEntitlements).mockResolvedValue(undefined)

      const result = await updateUser(mockRequest, userDetails)

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockRequest,
        'user-123',
        token
      )
      expect(result).toEqual({
        updatedUser: expectedUser,
        newScopes: undefined
      })
    })

    it('should handle multiple roles when updating user', async () => {
      const userDetails = {
        userId: 'user-456',
        roles: ['form-creator', 'form-editor']
      }

      const expectedUser = {
        userId: 'user-456',
        userRole: 'form-creator,form-editor'
      }

      const newScopes = ['form-read', 'form-edit']

      jest.mocked(lib.updateUser).mockResolvedValue(expectedUser)
      jest.mocked(refreshUserSessionEntitlements).mockResolvedValue(newScopes)

      const result = await updateUser(mockRequest, userDetails)

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockRequest,
        'user-456',
        token
      )
      expect(result).toEqual({
        updatedUser: expectedUser,
        newScopes
      })
    })

    it('should update user even if session refresh fails', async () => {
      const userDetails = {
        userId: 'user-789',
        roles: ['editor']
      }

      const expectedUser = {
        userId: 'user-789',
        userRole: 'editor'
      }

      jest.mocked(lib.updateUser).mockResolvedValue(expectedUser)
      jest
        .mocked(refreshUserSessionEntitlements)
        .mockRejectedValue(new Error('Session refresh failed'))

      await expect(updateUser(mockRequest, userDetails)).rejects.toThrow(
        'Session refresh failed'
      )

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockRequest,
        'user-789',
        token
      )
    })

    it('should throw error if updateUser fails', async () => {
      const userDetails = {
        userId: 'user-999',
        roles: ['admin']
      }

      const error = new Error('Failed to update user')
      jest.mocked(lib.updateUser).mockRejectedValue(error)

      await expect(updateUser(mockRequest, userDetails)).rejects.toThrow(
        'Failed to update user'
      )

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).not.toHaveBeenCalled()
    })
  })

  describe('deleteUser', () => {
    it('should delete user and drop session', async () => {
      const userId = 'user-to-delete'

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      mockSession.drop.mockResolvedValue(undefined)

      const wasSelfDeletion = await deleteUser(mockRequest, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(mockCookieAuth.clear).not.toHaveBeenCalled()
      expect(wasSelfDeletion).toBe(false)
    })

    it('should clear cookie when user deletes themselves', async () => {
      const userId = 'current-user' // Same as mockRequest.auth.credentials.user.id

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      mockSession.drop.mockResolvedValue(undefined)

      const wasSelfDeletion = await deleteUser(mockRequest, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(mockCookieAuth.clear).toHaveBeenCalled()
      expect(wasSelfDeletion).toBe(true)
    })

    it('should complete deletion even if session drop fails', async () => {
      const userId = 'user-with-no-session'

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      mockSession.drop.mockRejectedValue(new Error('Session not found'))

      const wasSelfDeletion = await deleteUser(mockRequest, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(wasSelfDeletion).toBe(false)
    })

    it('should throw error if deleteUser fails', async () => {
      const userId = 'protected-user'

      const error = new Error('Cannot delete protected user')
      jest.mocked(lib.deleteUser).mockRejectedValue(error)

      await expect(deleteUser(mockRequest, userId)).rejects.toThrow(
        'Cannot delete protected user'
      )

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).not.toHaveBeenCalled()
    })

    it('should handle deletion of non-existent user', async () => {
      const userId = 'non-existent-user'

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      mockSession.drop.mockResolvedValue(undefined)

      const wasSelfDeletion = await deleteUser(mockRequest, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(mockSession.drop).toHaveBeenCalledWith(userId)
      expect(wasSelfDeletion).toBe(false)
    })
  })
})

/**
 * @import { Request, Server } from '@hapi/hapi'
 */
