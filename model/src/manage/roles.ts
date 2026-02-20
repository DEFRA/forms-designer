export enum Roles {
  Superadmin = 'superadmin',
  Admin = 'admin',
  FormPublisher = 'form-publisher',
  FormCreator = 'form-creator'
}

export enum Scopes {
  FormDelete = 'form-delete',
  FormEdit = 'form-edit',
  FormRead = 'form-read',
  FormPublish = 'form-publish',
  UserCreate = 'user-create',
  UserDelete = 'user-delete',
  UserEdit = 'user-edit',
  FormsFeedback = 'forms-feedback',
  FormsBackup = 'forms-backup',
  ResetSaveAndExit = 'reset-save-and-exit'
}

export const RoleScopes = {
  [Roles.Superadmin]: Object.values(Scopes),
  [Roles.Admin]: [
    Scopes.FormDelete,
    Scopes.FormEdit,
    Scopes.FormRead,
    Scopes.FormPublish,
    Scopes.UserCreate,
    Scopes.UserDelete,
    Scopes.UserEdit,
    Scopes.FormsFeedback
  ],
  [Roles.FormPublisher]: [
    Scopes.FormDelete,
    Scopes.FormEdit,
    Scopes.FormRead,
    Scopes.FormPublish
  ],
  [Roles.FormCreator]: [Scopes.FormRead, Scopes.FormEdit, Scopes.FormDelete]
}

/**
 * Return a unique list of scopes based on the array of roles passed in
 */
export function mapScopesToRoles(roles: Roles[]) {
  const scopeSet = new Set<string>()
  roles.forEach((role) => {
    const scopes = RoleScopes[role]
    scopes.forEach((scope) => {
      scopeSet.add(scope)
    })
  })
  return Array.from(scopeSet)
}
