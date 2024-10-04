import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import hapi, { type ServerOptions } from '@hapi/hapi'
import inert from '@hapi/inert'
import Wreck from '@hapi/wreck'
import { ProxyAgent } from 'proxy-agent'

import { SCOPE_READ } from '~/src/common/constants/scopes.js'
import {
  azureOidc,
  azureOidcNoop
} from '~/src/common/helpers/auth/azure-oidc.js'
import { sessionCookie } from '~/src/common/helpers/auth/session-cookie.js'
import { requestLogger } from '~/src/common/helpers/logging/request-logger.js'
import { buildRedisClient } from '~/src/common/helpers/redis-client.js'
import { sessionManager } from '~/src/common/helpers/session-manager.js'
import * as nunjucks from '~/src/common/nunjucks/index.js'
import config from '~/src/config.js'
import errorPage from '~/src/plugins/errorPage.js'
import router from '~/src/plugins/router.js'

const proxyAgent = new ProxyAgent()

Wreck.agents = {
  https: proxyAgent,
  http: proxyAgent,
  httpsAllowUnauthorized: proxyAgent
}

const serverOptions = (): ServerOptions => {
  return {
    port: config.port,
    router: {
      stripTrailingSlash: true
    },
    routes: {
      auth: {
        mode: 'required',
        strategies: ['session'],
        access: {
          entity: 'user',
          scope: [`+${SCOPE_READ}`]
        }
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
    segment: 'session',
    expiresIn: config.sessionTtl
  })

  server.method('session.get', (id) => cache.get(id))
  server.method('session.set', (id, value) => cache.set(id, value))
  server.method('session.drop', (id) => cache.drop(id))

  server.method('state.get', (userId, key) => cache.get(`${userId}.${key}`))
  server.method('state.set', (userId, key, value, ttl) =>
    cache.set(`${userId}.${key}`, value, ttl)
  )
  server.method('state.drop', (userId, key) => cache.drop(`${userId}.${key}`))

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
  await server.register(errorPage)

  return server
}
