import { join, resolve } from 'node:path'
import { cwd } from 'node:process'

import { healthCheckRoute } from './routes'
import { login } from '../login'
import { logout } from '../logout'
import { auth } from '../auth'
import { home } from '../home'
import config from '../config'

const distPath = config.isDevelopment
  ? resolve(cwd(), 'dist') // npm run dev
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
    path: '/assets/{path*}',
    options: {
      auth: {
        mode: 'try'
      },
      handler: {
        directory: {
          path: join(distPath, 'client/assets')
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
