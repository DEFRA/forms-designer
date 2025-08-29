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
      return h.view('cookies')
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
