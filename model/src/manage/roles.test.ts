import { Roles, mapScopesToRoles } from '~/src/manage/roles.js'

describe('Scopes', () => {
  test('should return all Superadmin scopes', () => {
    expect(mapScopesToRoles([Roles.Superadmin])).toEqual([
      'form-delete',
      'form-edit',
      'form-read',
      'form-publish',
      'user-create',
      'user-delete',
      'user-edit',
      'forms-feedback',
      'forms-backup',
      'reset-save-and-exit'
    ])
  })

  test('should return all Admin scopes', () => {
    expect(mapScopesToRoles([Roles.Admin])).toEqual([
      'form-delete',
      'form-edit',
      'form-read',
      'form-publish',
      'user-create',
      'user-delete',
      'user-edit',
      'forms-feedback'
    ])
  })

  test('should return scopes without duplication', () => {
    expect(
      mapScopesToRoles([Roles.Admin, Roles.FormCreator, Roles.Admin])
    ).toEqual([
      'form-delete',
      'form-edit',
      'form-read',
      'form-publish',
      'user-create',
      'user-delete',
      'user-edit',
      'forms-feedback'
    ])
  })

  test('should return FormPublisher scopes', () => {
    expect(mapScopesToRoles([Roles.FormPublisher])).toEqual([
      'form-delete',
      'form-edit',
      'form-read',
      'form-publish'
    ])
  })

  test('should return FormCreator scopes', () => {
    expect(mapScopesToRoles([Roles.FormCreator])).toEqual([
      'form-read',
      'form-edit',
      'form-delete'
    ])
  })
})
