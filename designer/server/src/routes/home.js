import { homeViewModel } from '~/src/models/home.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/',
    handler(request, h) {
      return h.view('home', homeViewModel())
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
