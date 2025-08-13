import {
  dropUserSessionById,
  refreshUserSessionEntitlements
} from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
import * as lib from '~/src/lib/manage.js'
import { addUser, deleteUser, updateUser } from '~/src/services/userService.js'

jest.mock('~/src/lib/manage.js')
jest.mock('~/src/common/helpers/auth/refresh-user-session-entitlements.js')

describe('userService', () => {
  const mockServer = /** @type {Server} */ (
    /** @type {unknown} */ ({
      methods: {
        session: {
          get: jest.fn(),
          set: jest.fn(),
          drop: jest.fn()
        }
      }
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

      const result = await updateUser(mockServer, token, userDetails)

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockServer,
        'user-123',
        token
      )
      expect(result).toEqual(expectedUser)
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

      jest.mocked(lib.updateUser).mockResolvedValue(expectedUser)
      jest.mocked(refreshUserSessionEntitlements).mockResolvedValue(undefined)

      const result = await updateUser(mockServer, token, userDetails)

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockServer,
        'user-456',
        token
      )
      expect(result).toEqual(expectedUser)
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

      await expect(updateUser(mockServer, token, userDetails)).rejects.toThrow(
        'Session refresh failed'
      )

      expect(jest.mocked(lib.updateUser)).toHaveBeenCalledWith(
        token,
        userDetails
      )
      expect(jest.mocked(refreshUserSessionEntitlements)).toHaveBeenCalledWith(
        mockServer,
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

      await expect(updateUser(mockServer, token, userDetails)).rejects.toThrow(
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
      jest.mocked(dropUserSessionById).mockResolvedValue(undefined)

      await deleteUser(mockServer, token, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(dropUserSessionById)).toHaveBeenCalledWith(
        mockServer,
        userId
      )
    })

    it('should complete deletion even if session drop fails', async () => {
      const userId = 'user-with-no-session'

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      jest
        .mocked(dropUserSessionById)
        .mockRejectedValue(new Error('Session not found'))

      await expect(deleteUser(mockServer, token, userId)).rejects.toThrow(
        'Session not found'
      )

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(dropUserSessionById)).toHaveBeenCalledWith(
        mockServer,
        userId
      )
    })

    it('should throw error if deleteUser fails', async () => {
      const userId = 'protected-user'

      const error = new Error('Cannot delete protected user')
      jest.mocked(lib.deleteUser).mockRejectedValue(error)

      await expect(deleteUser(mockServer, token, userId)).rejects.toThrow(
        'Cannot delete protected user'
      )

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(dropUserSessionById)).not.toHaveBeenCalled()
    })

    it('should handle deletion of non-existent user', async () => {
      const userId = 'non-existent-user'

      jest.mocked(lib.deleteUser).mockResolvedValue(undefined)
      jest.mocked(dropUserSessionById).mockResolvedValue(undefined)

      await deleteUser(mockServer, token, userId)

      expect(jest.mocked(lib.deleteUser)).toHaveBeenCalledWith(token, userId)
      expect(jest.mocked(dropUserSessionById)).toHaveBeenCalledWith(
        mockServer,
        userId
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
