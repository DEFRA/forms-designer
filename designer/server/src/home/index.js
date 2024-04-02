import { homeController } from '~/src/home/controller'

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
