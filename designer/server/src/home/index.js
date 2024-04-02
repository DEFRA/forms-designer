import { homeController } from '~/src/home/controller.js'

const home = {
  plugin: {
    name: 'home',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          config: {
            auth: {
              mode: 'try'
            }
          },
          ...homeController
        }
      ])
    }
  }
}

export { home }
