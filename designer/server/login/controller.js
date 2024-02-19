import config from '../config'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => {
    // TODO re-vert to just h.redirect(config.appPathPrefix) once feature flag removed
    // re-visit 2024-02-26
    if (config.oidcWellKnownConfigurationUrl) {
      return h.redirect(config.appPathPrefix)
    } else {
      return h.redirect(`${config.appPathPrefix}/auth/callback`)
    }
  }
}

export { loginController }
