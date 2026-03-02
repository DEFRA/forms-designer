import { Roles } from '@defra/forms-model'

import {
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
  })

  describe('getDescriptionForRole', () => {
    test('should return correct description for superadmin role', () => {
      const result = getDescriptionForRole(Roles.Superadmin)
      expect(result).toBe(
        'Can manage forms, users and perform system administration tasks'
      )
    })

    test('should return correct description for admin role', () => {
      const result = getDescriptionForRole(Roles.Admin)
      expect(result).toBe('Can publish and delete forms and manage users')
    })

    test('should return correct description for form-publisher role', () => {
      const result = getDescriptionForRole(Roles.FormPublisher)
      expect(result).toBe('Can create, edit and publish forms')
    })

    test('should return correct description for form-creator role', () => {
      const result = getDescriptionForRole(Roles.FormCreator)
      expect(result).toBe('Can create and edit existing forms only')
    })
  })
})
