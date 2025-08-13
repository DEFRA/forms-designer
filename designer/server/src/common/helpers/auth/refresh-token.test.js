import { refreshAccessToken } from '~/src/common/helpers/auth/refresh-token.js'
import * as oidc from '~/src/lib/oidc.js'
import { authAuditUser } from '~/src/messaging/__stubs__/users.js'
import { publishAuthenticationLogoutAutoEvent } from '~/src/messaging/publish.js'

jest.mock('~/src/lib/oidc.js')
jest.mock('~/src/common/helpers/auth/drop-user-session.js')
jest.mock('~/src/messaging/publish.js')

describe('refresh-token', () => {
  test('should throw if user not logged in', async () => {
    const mockRequest = /** @type {Request} */ ({
      auth: {
        credentials: {}
      }
    })
    await expect(() => refreshAccessToken(mockRequest)).rejects.toThrow()
  })

  test('should return token if user logged in', async () => {
    const mockRequest = /** @type {Request} */ ({
      auth: {
        credentials: {
          user: authAuditUser,
          token: 'my-token',
          idToken: 'id-token',
          refreshToken: 'refresh-token'
        }
      }
    })
    await refreshAccessToken(mockRequest)
    expect(oidc.getToken).toHaveBeenCalled()
  })

  test('should publish audit record and throw if fails to refresh token', async () => {
    const mockRequest = /** @type {Request} */ ({
      auth: {
        credentials: {
          user: authAuditUser,
          token: 'my-token',
          idToken: 'id-token',
          refreshToken: 'refresh-token'
        }
      }
    })
    jest.mocked(oidc.getToken).mockImplementation(() => {
      throw new Error('failed to refresh token')
    })
    await expect(() => refreshAccessToken(mockRequest)).rejects.toThrow()
    expect(publishAuthenticationLogoutAutoEvent).toHaveBeenCalled()
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 */
