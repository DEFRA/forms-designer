import { listLibraryViewModel } from '../models/library.js'

export default [
  {
    method: 'GET',
    path: '/library',
    handler: async (request, h) => {
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
