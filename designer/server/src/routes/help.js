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
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/help/feedback',
    handler(request, h) {
      return h.view('feedback')
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').RouteOptions} RouteOptions
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
