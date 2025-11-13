import { hasCredentials } from '~/src/common/helpers/auth/get-user-session.js'
import { authAuditUser } from '~/src/messaging/__stubs__/users.js'

describe('get-user-session', () => {
  test('hasCredentials should return true when credentials are passed', () => {
    const result = hasCredentials({
      user: authAuditUser,
      token: 'my-token',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      provider: 'azure-oidc',
      query: { key: '' },
      flowId: '',
      expiresIn: 1
    })

    expect(result).toBe(true)
  })

  test('hasCredentials should return false when credentials are not passed', () => {
    expect(hasCredentials(null)).toBe(false)
    expect(hasCredentials(undefined)).toBe(false)
  })
})
