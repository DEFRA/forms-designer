import routes from '~/src/routes/index.js'

export default {
  plugin: {
    name: 'router',
    register: async (server, options) => {
      await server.route(routes)
    }
  }
}
