export const Roles = {
  Admin: 'admin',
  FormCreator: 'form-creator'
}

export const RoleNames = {
  [Roles.Admin]: 'Admin',
  [Roles.FormCreator]: 'Form creator'
}

export const RoleDescriptions = {
  [Roles.Admin]: 'Can publish and delete forms and manage users',
  [Roles.FormCreator]: 'Can create and edit existing forms only'
}

/**
 * @param {string} role
 */
export function getNameForRole(role) {
  return RoleNames[role] ?? role
}

/**
 * @param {string} role
 */
export function getDescriptionForRole(role) {
  return RoleDescriptions[role] ?? ''
}
