export enum Roles {
  Admin = 'admin',
  FormCreator = 'form-creator'
}

export enum Scopes {
  FormDelete = 'form-delete',
  FormEdit = 'form-edit',
  FormRead = 'form-read',
  FormPublish = 'form-publish',
  UserCreate = 'user-create',
  UserDelete = 'user-delete',
  UserEdit = 'user-edit'
}

export const RoleScopes = {
  [Roles.Admin]: Object.entries(Scopes).map((x) => x[1]),
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
