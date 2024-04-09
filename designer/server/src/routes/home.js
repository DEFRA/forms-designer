import { homeViewModel } from '../models/home.js'

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
