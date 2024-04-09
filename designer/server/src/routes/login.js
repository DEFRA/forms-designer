import config from '~/src/config.js'

/**
 * @type {ServerRoute}
 */
export default {
  method: 'GET',
  path: '/login',
  handler(request, h) {
    return h.redirect(config.appPathPrefix)
  },
  options: {
    auth: {
      mode: 'optional',
      strategy: 'azure-oidc'
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
