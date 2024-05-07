import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import hapi, { type ServerOptions } from '@hapi/hapi'
import inert from '@hapi/inert'

import {
  azureOidc,
  azureOidcNoop
} from '~/src/common/helpers/auth/azure-oidc.js'
import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { getUserSession } from '~/src/common/helpers/auth/get-user-session.js'
import { sessionCookie } from '~/src/common/helpers/auth/session-cookie.js'
import { requestLogger } from '~/src/common/helpers/logging/request-logger.js'
import { buildRedisClient } from '~/src/common/helpers/redis-client.js'
import { sessionManager } from '~/src/common/helpers/session-manager.js'
import * as nunjucks from '~/src/common/nunjucks/index.js'
import config from '~/src/config.js'
import router from '~/src/plugins/router.js'

const serverOptions = (): ServerOptions => {
  return {
    port: config.port,
    router: {
      stripTrailingSlash: true
    },
    routes: {
      auth: {
        mode: 'required',
        strategies: ['session']
      },
      validate: {
        options: {
          abortEarly: false
        }
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    cache: [
      {
        name: 'session',
        engine: config.isTest
          ? new CatboxMemory()
          : new CatboxRedis({
              partition: config.redisKeyPrefix,
              client: buildRedisClient()
            })
      }
    ]
  }
}

export async function createServer() {
  const server = hapi.server(serverOptions())

  const cache = server.cache({
    cache: 'session',
    segment: config.redisKeyPrefix,
    expiresIn: config.sessionTtl
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)
  server.method('session.get', (id) => cache.get(id))
  server.method('session.set', (id, value) => cache.set(id, value))
  server.method('session.drop', (id) => cache.drop(id))

  await server.register(inert)
  await server.register(sessionManager)

  await server.register(
    config.isTest
      ? azureOidcNoop // Mock auth for tests
      : azureOidc // OpenID Connect (OIDC) auth
  )

  await server.register(sessionCookie)
  await server.register(nunjucks.plugin)
  await server.register(router)
  await server.register(requestLogger)

  return server
}
