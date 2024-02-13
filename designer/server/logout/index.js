import { logoutController } from '../logout/controller'

const logout = {
  plugin: {
    name: 'logout',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/logout',
          ...logoutController
        }
      ])
    }
  }
}

export { logout }
