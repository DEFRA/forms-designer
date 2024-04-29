/**
 * @type {ServerRoute}
 */
export default {
  method: 'GET',
  path: '/login',
  handler(request, h) {
    return h.redirect('/')
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
