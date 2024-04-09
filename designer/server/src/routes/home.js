import { homeViewModel } from '~/src/models/home.js'

/**
 * @type {ServerRoute}
 */
export default {
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
}

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
