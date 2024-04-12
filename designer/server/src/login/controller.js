import config from '~/src/config.js'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler(request, h) {
    return h.redirect(config.appPathPrefix)
  }
}

export { loginController }
