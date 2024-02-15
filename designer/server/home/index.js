import { homeController } from "./controller"

const home = {
  plugin: {
    name: 'home',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          config : {
            auth : {
              mode: 'optional'
            }
          },
          ...homeController
        }
      ])
    }
  }
}

export { home }
