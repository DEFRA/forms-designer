import { Roles, mapScopesToRoles } from '~/src/manage/roles.js'

describe('Scopes', () => {
  test('should return all Admin scopes', () => {
    expect(mapScopesToRoles([Roles.Admin])).toEqual([
      'form-delete',
      'form-edit',
      'form-read',
      'form-publish',
      'user-create',
      'user-delete',
      'user-edit'
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
      'user-edit'
    ])
  })
})
