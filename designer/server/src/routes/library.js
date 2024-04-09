import { listLibraryViewModel } from '~/src/models/library.js'

/**
 * @type {ServerRoute[]}
 */
export default [
  {
    method: 'GET',
    path: '/library',
    async handler(request, h) {
      const model = await listLibraryViewModel()

      return h.view('library', model)
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
