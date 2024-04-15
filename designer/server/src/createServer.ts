import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import hapi, { type ServerOptions } from '@hapi/hapi'
import inert from '@hapi/inert'
import Scooter from '@hapi/scooter'
import Schmervice from '@hapipal/schmervice'

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
import { PreviewPersistenceService } from '~/src/lib/persistence/previewPersistenceService.js'
import { configureBlankiePlugin } from '~/src/plugins/blankie.js'
import { designerPlugin } from '~/src/plugins/designer.js'
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
        strategy: 'session'
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

const registrationOptions = {
  routes: { prefix: config.appPathPrefix }
}

export async function createServer() {
  const server = hapi.server(serverOptions())

  server.app.cache = server.cache({
    cache: 'session',
    segment: config.redisKeyPrefix,
    expiresIn: config.sessionTtl
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)

  await server.register(inert, registrationOptions)
  await server.register(sessionManager)

  await server.register(
    config.isTest
      ? azureOidcNoop // Mock auth for tests
      : azureOidc // OpenID Connect (OIDC) auth
  )

  await server.register(sessionCookie)

  await server.register(Scooter)
  await server.register(configureBlankiePlugin())
  await server.register(nunjucks.plugin, registrationOptions)
  await server.register(Schmervice)
  server.registerService([
    Schmervice.withName('persistenceService', {}, PreviewPersistenceService)
  ])
  await server.register(designerPlugin, registrationOptions)
  await server.register(router, registrationOptions)
  await server.register(requestLogger)

  return server
}
