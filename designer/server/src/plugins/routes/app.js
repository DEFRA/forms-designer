import config from '~/src/config.js'

/**
 * @type {ServerRoute}
 */
export const getAppChildRoutes = {
  method: 'get',
  path: '/editor/{path*}',
  options: {
    handler(request, h) {
      return h.view('editor', {
        phase: config.phase,
        previewUrl: config.previewUrl
      })
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
