import { getErrorMessage } from '@defra/forms-model'
import { Cluster, Redis } from 'ioredis'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'

/**
 * Setup Redis and provide a redis client
 *
 * Local development - 1 Redis instance
 * Out in the wild - Elasticache / Redis Cluster with username and password
 */
function buildRedisClient() {
  const logger = createLogger()

  const port = 6379
  const db = 0
  let redisClient

  if (config.useSingleInstanceCache) {
    logger.info('Connecting to Redis using single instance')

    redisClient = new Redis({
      username: config.redisUsername,
      password: config.redisPassword,
      port,
      host: config.redisHost,
      db,
      keyPrefix: config.redisKeyPrefix
    })
  } else {
    logger.info('Connecting to Redis using cluster')

    redisClient = new Cluster(
      [
        {
          host: config.redisHost,
          port
        }
      ],
      {
        keyPrefix: config.redisKeyPrefix,
        slotsRefreshTimeout: 2000,
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          username: config.redisUsername,
          password: config.redisPassword,
          db,
          tls: {}
        }
      }
    )
  }

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server')
  })

  redisClient.on('close', () => {
    logger.warn(
      'Redis connection closed attempting reconnect with default behavior'
    )
  })

  redisClient.on('error', (err) => {
    logger.error(err, `Redis connection error ${getErrorMessage(err)}.`)
  })

  return redisClient
}

export { buildRedisClient }
