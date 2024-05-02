import { homeViewModel } from '~/src/models/home.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler(request, h) {
    const model = homeViewModel()
    return h.view('home', model)
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
