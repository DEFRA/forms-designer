import { RoleNames, Roles } from '@defra/forms-model'

export const RoleDescriptions = {
  [Roles.Superadmin]:
    'Can manage forms, users and perform system administration tasks',
  [Roles.Admin]: 'Can publish and delete forms and manage users',
  [Roles.FormPublisher]: 'Can create, edit and publish forms',
  [Roles.FormCreator]: 'Can create and edit existing forms only'
}

/**
 * @param {Roles} role
 */
export function getNameForRole(role) {
  return RoleNames[role]
}

/**
 * @param {Roles} role
 */
export function getDescriptionForRole(role) {
  return RoleDescriptions[role]
}
