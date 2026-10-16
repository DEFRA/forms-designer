import { hasAuthenticated } from '~/src/common/helpers/auth/get-user-session.js'
import { websiteCookiesModel } from '~/src/models/cookies.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/help/accessibility-statement',
    handler(request, h) {
      return h.view('accessibility-statement')
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/help/cookies',
    handler(request, h) {
      const isGuest = !hasAuthenticated(request.auth.credentials)
      return h.view('cookies', websiteCookiesModel(isGuest))
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
