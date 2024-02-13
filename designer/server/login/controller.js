const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => h.redirect('/forms-designer')
}

export { loginController }
