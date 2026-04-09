import {
  getUserScopes,
  mapUserForAudit
} from '~/src/common/helpers/auth/user-helper.js'
import { authAuditUser } from '~/src/messaging/__stubs__/users.js'

describe('user-helper', () => {
  test('should map user', () => {
    const res = mapUserForAudit(authAuditUser)
    expect(res).toEqual({
      id: authAuditUser.id,
      displayName: authAuditUser.displayName
    })
  })

  test('should throw if user missing', () => {
    expect(() => mapUserForAudit(undefined)).toThrow(
      'Missing user for auditing'
    )
  })

  describe('getUserScopes', () => {
    it('should return empty array if no credentials', () => {
      expect(getUserScopes(undefined)).toEqual([])
    })

    it('should return empty array if undefined credentials', () => {
      expect(getUserScopes({})).toEqual([])
    })

    it('should return empty array if undefined credentials 2', () => {
      expect(getUserScopes({ credentials: undefined })).toEqual([])
    })

    it('should return empty array if undefined scopes', () => {
      expect(getUserScopes({ credentials: { scope: undefined } })).toEqual([])
    })

    it('should return empty array if no scopes', () => {
      expect(getUserScopes({ credentials: { scope: [] } })).toEqual([])
    })

    it('should return array if some scopes', () => {
      expect(
        getUserScopes({ credentials: { scope: ['scope1', 'scope2'] } })
      ).toEqual(['scope1', 'scope2'])
    })
  })
})
