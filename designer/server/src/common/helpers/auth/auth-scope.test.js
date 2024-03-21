import { authScope } from './auth-scope'

describe('#authScope', () => {
  test('Should add scope to route as expected', () => {
    const authScopeMethod = authScope(['+mockScope'])

    expect(
      authScopeMethod({
        method: 'GET',
        path: '/admin/teams/{teamId}'
      })
    ).toEqual({
      method: 'GET',
      options: {
        auth: {
          access: {
            scope: ['+mockScope']
          },
          mode: 'required'
        }
      },
      path: '/admin/teams/{teamId}'
    })
  })
  describe('When route has existing options', () => {
    test('Should add scope to route as expected', () => {
      const authScopeMethod = authScope(['+mockScope'])

      expect(
        authScopeMethod({
          method: 'POST',
          path: '/admin/teams/{teamId}',
          options: {
            pre: []
          }
        })
      ).toEqual({
        method: 'POST',
        options: {
          auth: {
            access: {
              scope: ['+mockScope']
            },
            mode: 'required'
          },
          pre: []
        },
        path: '/admin/teams/{teamId}'
      })
    })
  })
})
