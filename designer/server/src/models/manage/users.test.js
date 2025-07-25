import { mapRoleName } from '~/src/models/manage/users.js'

describe('Manage models', () => {
  test('should handle invalid role name', () => {
    expect(mapRoleName('invalid')).toBe('Unknown')
  })
})
