import config from '~/src/config.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'get',
    path: '/editor/{path*}',
    options: {
      handler(request, h) {
        return h.view('forms/views/editor', {
          phase: config.phase,
          previewUrl: config.previewUrl
        })
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
