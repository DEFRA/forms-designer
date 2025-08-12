import { mapUserForAudit } from '~/src/common/helpers/auth/user-helper.js'
import { authAuditUser } from '~/src/messaging/__stubs__/users.js'

describe('user-helper', () => {
  test('should map user', () => {
    const res = mapUserForAudit(authAuditUser)
    expect(res).toEqual({
      id: authAuditUser.id,
      displayName: authAuditUser.displayName
    })
  })
})
