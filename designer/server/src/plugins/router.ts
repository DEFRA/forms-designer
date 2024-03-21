import { join, resolve } from 'node:path'
import { cwd } from 'node:process'

import { auth } from '~/src/auth/index.js'
import config from '~/src/config.js'
import { home } from '~/src/home/index.js'
import { login } from '~/src/login/index.js'
import { logout } from '~/src/logout/index.js'
import { healthCheckRoute } from '~/src/plugins/routes/index.js'

const distPath = config.isDevelopment
  ? resolve(cwd(), '../dist') // npm run dev
  : resolve(cwd()) // npm run build

const routes = [
  healthCheckRoute,
  {
    method: 'GET',
    path: '/robots.txt',
    options: {
      auth: {
        mode: 'try'
      },
      handler: {
        file: 'server/public/static/robots.txt'
      }
    }
  },
  {
    method: 'GET',
    path: '/javascripts/{path*}',
    options: {
      auth: {
        mode: 'try'
      },
      handler: {
        directory: {
          path: join(distPath, '../../client/dist/javascripts')
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/stylesheets/{path*}',
    options: {
      auth: {
        mode: 'try'
      },
      handler: {
        directory: {
          path: join(distPath, '../../client/dist/stylesheets')
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      auth: {
        mode: 'try'
      },
      handler: {
        directory: {
          path: join(distPath, '../../client/dist/assets')
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/help/{filename}',
    options: {
      auth: {
        mode: 'try'
      }
    },
    handler: function (request, h) {
      return h.view(`help/${request.params.filename}`)
    }
  }
]

export default {
  plugin: {
    name: 'router',
    register: async (server, _options) => {
      await server.register([auth, login, logout, home], _options)

      await server.route(routes)
    }
  }
}
