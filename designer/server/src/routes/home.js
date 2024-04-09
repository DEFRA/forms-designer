import { homeViewModel } from '../models/home.js'

export default {
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    return h.view('home', homeViewModel())
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
}
