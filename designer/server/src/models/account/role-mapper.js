export const Roles = {
  Superadmin: 'admin',
  Admin: 'admin',
  FormPublisher: 'form-publisher',
  FormCreator: 'form-creator'
}

export const RoleNames = {
  [Roles.Superadmin]: 'Superadmin',
  [Roles.Admin]: 'Admin',
  [Roles.FormPublisher]: 'Form publisher',
  [Roles.FormCreator]: 'Form creator'
}

export const RoleDescriptions = {
  [Roles.Superadmin]: 'Can publish and delete forms and manage users',
  [Roles.Admin]: 'Can publish and delete forms and manage users',
  [Roles.FormPublisher]: 'Can create, edit and publish forms',
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
