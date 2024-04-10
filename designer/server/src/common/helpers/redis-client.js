import { Redis } from 'ioredis'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'

/**
 * Setup Redis and provide a redis client
 *
 * Local development - 1 Redis instance
 * Out in the wild - Elasticache / Redis Cluster with username and password
 * @returns {import('ioredis').Cluster | import('ioredis').Redis}
 */
function buildRedisClient() {
  const logger = createLogger()

  const port = 6379
  const db = 0
  let redisClient

  if (!config.isProduction) {
    logger.info('Connecting to Redis using single instance')

    redisClient = new Redis({
      username: config.redisUsername,
      password: config.redisPassword,
      port,
      host: config.redisHost,
      db
    })
  } else {
    logger.info('Connecting to Redis using cluster')

    redisClient = new Redis.Cluster(
      [
        {
          host: config.redisHost,
          port
        }
      ],
      {
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

  // TODO add proper logger

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server')
  })

  redisClient.on('close', () => {
    logger.info('Redis connection closed attempting reconnect')
    redisClient.connect()
  })

  redisClient.on('error', (error) => {
    logger.error(error, `Redis connection error ${error}.`)
  })

  return redisClient
}

export { buildRedisClient }
