export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/help/accessibility-statement',
    handler(request, h) {
      return h.view('generic/views/accessibility-statement')
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
      return h.view('generic/views/cookies')
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
      return h.view('generic/views/feedback')
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
