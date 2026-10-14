import {
  hasAdminRole,
  hasCredentials,
  hasSuperadminRole
} from '~/src/common/helpers/auth/get-user-session.js'
import { authAuditUser } from '~/src/messaging/__stubs__/users.js'
import {
  auth,
  authFormCreator,
  authFormPublisher,
  authSuperAdmin
} from '~/test/fixtures/auth.js'

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

  test('hasAdminRole should return true when superadmin credentials are passed', () => {
    const result = hasAdminRole(authSuperAdmin.credentials.user)

    expect(result).toBe(true)
  })

  test('hasAdminRole should return true when admin credentials are passed', () => {
    const result = hasAdminRole(auth.credentials.user)

    expect(result).toBe(true)
  })

  test('hasAdminRole should return false when form publisher credentials are passed', () => {
    const result = hasAdminRole(authFormPublisher.credentials.user)

    expect(result).toBe(false)
  })

  test('hasAdminRole should return false when form creator credentials are passed', () => {
    const result = hasAdminRole(authFormCreator.credentials.user)

    expect(result).toBe(false)
  })

  test('hasAdminRole should return false when no credentials are passed', () => {
    const result = hasAdminRole(undefined)

    expect(result).toBe(false)
  })

  test('hasSuperadminRole should return true when superadmin credentials are passed', () => {
    const result = hasSuperadminRole(authSuperAdmin.credentials.user)

    expect(result).toBe(true)
  })

  test('hasSuperadminRole should return false when admin credentials are passed', () => {
    const result = hasSuperadminRole(auth.credentials.user)

    expect(result).toBe(false)
  })

  test('hasSuperadminRole should return false when form publisher credentials are passed', () => {
    const result = hasSuperadminRole(authFormPublisher.credentials.user)

    expect(result).toBe(false)
  })

  test('hasSuperadminRole should return false when form creator credentials are passed', () => {
    const result = hasSuperadminRole(authFormCreator.credentials.user)

    expect(result).toBe(false)
  })

  test('hasSuperadminRole should return false when no credentials are passed', () => {
    const result = hasSuperadminRole(undefined)

    expect(result).toBe(false)
  })
})
