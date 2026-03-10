import { Roles, Scopes, mapScopesToRoles } from '~/src/manage/roles.js'

describe('Scopes', () => {
  test('should return all Superadmin scopes', () => {
    expect(mapScopesToRoles([Roles.Superadmin])).toEqual([
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormPublish,
      Scopes.UserCreate,
      Scopes.UserDelete,
      Scopes.UserEdit,
      Scopes.FormsFeedback,
      'forms-backup',
      'reset-save-and-exit'
    ])
  })

  test('should return all Admin scopes', () => {
    expect(mapScopesToRoles([Roles.Admin])).toEqual([
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormPublish,
      Scopes.UserCreate,
      Scopes.UserDelete,
      Scopes.UserEdit,
      Scopes.FormsFeedback
    ])
  })

  test('should return scopes without duplication', () => {
    expect(
      mapScopesToRoles([Roles.Admin, Roles.FormCreator, Roles.Admin])
    ).toEqual([
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormPublish,
      Scopes.UserCreate,
      Scopes.UserDelete,
      Scopes.UserEdit,
      Scopes.FormsFeedback
    ])
  })

  test('should return FormPublisher scopes', () => {
    expect(mapScopesToRoles([Roles.FormPublisher])).toEqual([
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormPublish
    ])
  })

  test('should return FormCreator scopes', () => {
    expect(mapScopesToRoles([Roles.FormCreator])).toEqual([
      Scopes.FormRead,
      Scopes.FormEdit,
      Scopes.FormDelete
    ])
  })
})
