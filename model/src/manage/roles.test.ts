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
      Scopes.FormsFeedbackAllForms,
      Scopes.FormsBackup,
      Scopes.ResetSaveAndExit,
      Scopes.DeadLetterQueues,
      Scopes.FormsInspect,
      Scopes.FormsReport,
      Scopes.RegenerateMetrics
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
      Scopes.FormsFeedback,
      Scopes.FormsFeedbackAllForms,
      Scopes.FormsReport
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
      Scopes.FormsFeedback,
      Scopes.FormsFeedbackAllForms,
      Scopes.FormsReport
    ])
  })

  test('should return FormPublisher scopes', () => {
    expect(mapScopesToRoles([Roles.FormPublisher])).toEqual([
      Scopes.FormDelete,
      Scopes.FormEdit,
      Scopes.FormRead,
      Scopes.FormPublish,
      Scopes.FormsFeedback
    ])
  })

  test('should return FormCreator scopes', () => {
    expect(mapScopesToRoles([Roles.FormCreator])).toEqual([
      Scopes.FormRead,
      Scopes.FormEdit,
      Scopes.FormDelete,
      Scopes.FormsFeedback
    ])
  })
})
