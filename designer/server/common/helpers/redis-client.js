import IoRedis from 'ioredis'

import config from '../../config'
import { createLogger } from '../helpers/logging/logger'

/**
 * Setup Redis and provide a redis client
 *
 * Local development - 1 Redis instance
 * Out in the wild - Elasticache / Redis Cluster with username and password
 *
 * @returns {Cluster | Redis}
 */
function buildRedisClient() {
  const logger = createLogger()

  const port = 6379
  const db = 0
  let redisClient

  if (config.useSingleInstanceCache) {
    logger.info('Connecting to Redis using single instance')

    redisClient = new IoRedis({
      username: config.redisUsername,
      password: config.redisPassword,
      port,
      host: config.redisHost,
      db
    })
  } else {
    logger.info('Connecting to Redis using cluster')

    redisClient = new IoRedis.Cluster(
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
