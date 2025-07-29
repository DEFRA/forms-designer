import { allRoles } from '~/src/lib/__stubs__/roles.js'
import { mapRoleName } from '~/src/models/manage/users.js'

describe('Manage models', () => {
  test('should handle valid role name', () => {
    expect(mapRoleName('form-creator', allRoles)).toBe('Form creator')
  })

  test('should handle invalid role name', () => {
    expect(mapRoleName('invalid', allRoles)).toBe('Unknown')
  })
})
