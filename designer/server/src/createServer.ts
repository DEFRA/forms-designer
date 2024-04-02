import hapi from '@hapi/hapi'
import inert from '@hapi/inert'
import Scooter from '@hapi/scooter'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import router from '~/src/plugins/router.js'
import { designerPlugin } from '~/src/plugins/designer.js'
import Schmervice from 'schmervice'
import config from '~/src/config.js'
import { determinePersistenceService } from '~/src/lib/persistence/index.js'
import { configureBlankiePlugin } from '~/src/plugins/blankie.js'
import {
  azureOidc,
  azureOidcNoop
} from '~/src/common/helpers/auth/azure-oidc.js'
import { authedFetcher } from '~/src/common/helpers/fetch/authed-fetcher.js'
import { sessionManager } from '~/src/common/helpers/session-manager.js'
import { sessionCookie } from '~/src/common/helpers/auth/session-cookie.js'
import { getUserSession } from '~/src/common/helpers/auth/get-user-session.js'
import { dropUserSession } from '~/src/common/helpers/auth/drop-user-session.js'
import { buildRedisClient } from '~/src/common/helpers/redis-client.js'
import { nunjucksConfig } from '~/src/common/nunjucks/index.js'
import { requestLogger } from '~/src/common/helpers/logging/request-logger.js'

const client = buildRedisClient()

const serverOptions = () => {
  return {
    port: process.env.PORT || 3000,
    router: {
      stripTrailingSlash: true
    },
    routes: {
      auth: { mode: 'required' },
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
        xss: true,
        noSniff: true,
        xframe: true
      }
    },
    cache: [
      {
        name: 'session',
        engine: new CatboxRedis({
          partition: config.redisKeyPrefix,
          client
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
    expiresIn: config.redisTtl
  })

  server.decorate('request', 'authedFetcher', authedFetcher, {
    apply: true
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)

  await server.register(inert, registrationOptions)
  await server.register(sessionManager)

  if (config.oidcWellKnownConfigurationUrl) {
    await server.register(azureOidc)
  } else {
    await server.register(azureOidcNoop)
  }

  await server.register(sessionCookie)

  await server.register(Scooter)
  await server.register(configureBlankiePlugin())
  // await server.register(viewPlugin, registrationOptions);
  await server.register(nunjucksConfig, registrationOptions)
  await server.register(Schmervice)
  ;(server as any).registerService([
    Schmervice.withName(
      'persistenceService',
      determinePersistenceService(config.persistentBackend, server)
    )
  ])
  await server.register(designerPlugin, registrationOptions)
  await server.register(router, registrationOptions)
  await server.register(requestLogger)

  return server
}
