import config from '~/src/config.js'

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
