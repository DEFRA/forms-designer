import { loginController } from '../login/controller'

const login = {
  plugin: {
    name: 'login',
    config : {
      auth : {
          mode: 'optional'
      }
    },
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/login',
          ...loginController
        }
      ])
    }
  }
}

export { login }
