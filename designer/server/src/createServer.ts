import Stream from 'node:stream'

import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import hapi, {
  type Request,
  type ResponseToolkit,
  type ServerOptions
} from '@hapi/hapi'
import inert from '@hapi/inert'
import Wreck from '@hapi/wreck'
import { ProxyAgent } from 'proxy-agent'
import qs from 'qs'

import { SCOPE_READ } from '~/src/common/constants/scopes.js'
import {
  azureOidc,
  azureOidcNoop
} from '~/src/common/helpers/auth/azure-oidc.js'
import { sessionCookie } from '~/src/common/helpers/auth/session-cookie.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { requestLogger } from '~/src/common/helpers/logging/request-logger.js'
import { buildRedisClient } from '~/src/common/helpers/redis-client.js'
import { requestTracing } from '~/src/common/helpers/request-tracing.js'
import { sessionManager } from '~/src/common/helpers/session-manager.js'
import * as nunjucks from '~/src/common/nunjucks/index.js'
import config from '~/src/config.js'
import errorPage from '~/src/plugins/errorPage.js'
import router from '~/src/plugins/router.js'

const logger = createLogger()

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
          abortEarly: false,
          errors: {
            wrap: {
              array: false,
              label: false
            }
          }
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
    ],
    state: {
      strictHeader: false
    }
  }
}

export function leftPadDateIfSupplied(val?: string) {
  return val ? val.padStart(2, '0') : ''
}

/**
 * The GDS 3-part date field is handled but submitting the day/month/year parts as separate fields
 * (under a different array to the other 'condition items') and then piecing together a string date value
 * in the format YYYY-MM-DD
 */
export function handleGdsDateFields(payload: {
  itemAbsDates?: { day?: string; month?: string; year?: string }[]
  items: []
}) {
  const multipartDateFields = payload.itemAbsDates as
    | { day?: string; month?: string; year?: string }[]
    | undefined
  if (multipartDateFields) {
    for (let i = 0; i < multipartDateFields.length; i++) {
      const item = multipartDateFields[i]
      if (payload.items[i]) {
        // @ts-expect-error - dynamic parsing
        payload.items[i].value =
          `${item.year}-${leftPadDateIfSupplied(item.month)}-${leftPadDateIfSupplied(item.day)}`
      }
    }
    delete payload.itemAbsDates
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

  server.ext('onRequest', (request: Request, h: ResponseToolkit) => {
    const baseUrl = config.appBaseUrl // e.g. https://forms.defra.gov.uk

    const baseDomain = new URL(baseUrl).hostname.toLowerCase() // e.g. forms.defra.gov.uk
    const requestDomain = request.info.hostname.toLowerCase() // e.g. forms-designer.prod.cdp-int.cdp.cloud

    // if the user is accessing the old URL
    if (requestDomain !== 'localhost' && requestDomain !== baseDomain) {
      logger.debug(
        `Request domain ${requestDomain} did not match base domain ${baseDomain}`
      )

      // create a new URL from the original as that includes the port, then override the hostname only
      const redirectUrl = new URL(request.url)
      redirectUrl.hostname = baseDomain

      logger.debug(
        `Redirecting to ${request.url.toString()} to ${redirectUrl.toString()}`
      )

      return h.redirect(redirectUrl.toString()).permanent().takeover()
    }

    return h.continue
  })

  server.ext('onPostAuth', (request: Request, h: ResponseToolkit) => {
    const supportedRoutes = [
      '/library/{slug}/editor-v2/condition/{conditionId}/{stateId?}'
    ]

    if (
      request.method === 'post' &&
      typeof request.payload === 'object' &&
      supportedRoutes.includes(request.route.path) &&
      !(request.payload instanceof Stream) &&
      !Buffer.isBuffer(request.payload)
    ) {
      const payload = request.payload as Record<string, string>

      // @ts-expect-error - dynamic parsing
      request.payload = qs.parse(payload)

      // @ts-expect-error - dynamic parsing
      handleGdsDateFields(request.payload)
    }

    return h.continue
  })

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
  await server.register(requestTracing)
  await server.register(errorPage)

  return server
}
