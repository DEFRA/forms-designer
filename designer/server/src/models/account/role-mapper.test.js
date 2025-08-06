import {
  Roles,
  getDescriptionForRole,
  getNameForRole
} from '~/src/models/account/role-mapper.js'

describe('Role mapper', () => {
  describe('getNameForRole', () => {
    test('should return correct name for admin role', () => {
      const result = getNameForRole(Roles.Admin)
      expect(result).toBe('Admin')
    })

    test('should return correct name for form-creator role', () => {
      const result = getNameForRole(Roles.FormCreator)
      expect(result).toBe('Form creator')
    })

    test('should return the role itself for unknown role', () => {
      const unknownRole = 'unknown-role'
      const result = getNameForRole(unknownRole)
      expect(result).toBe(unknownRole)
    })
  })

  describe('getDescriptionForRole', () => {
    test('should return correct description for admin role', () => {
      const result = getDescriptionForRole(Roles.Admin)
      expect(result).toBe('Can publish and delete forms and manage users')
    })

    test('should return correct description for form-creator role', () => {
      const result = getDescriptionForRole(Roles.FormCreator)
      expect(result).toBe('Can create and edit existing forms only')
    })

    test('should return empty string for unknown role', () => {
      const unknownRole = 'unknown-role'
      const result = getDescriptionForRole(unknownRole)
      expect(result).toBe('')
    })
  })
})
