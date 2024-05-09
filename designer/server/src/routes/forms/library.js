import * as scopes from '~/src/common/constants/scopes.js'
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
        mode: 'required',
        access: {
          scope: [`+${scopes.SCOPE_READ}`]
        }
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
