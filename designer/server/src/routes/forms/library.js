import * as library from '~/src/models/forms/library.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library',
    async handler(request, h) {
      const model = await library.listViewModel()
      return h.view('forms/library', model)
    },
    options: {
      auth: {
        mode: 'optional',
        strategy: 'azure-oidc'
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
