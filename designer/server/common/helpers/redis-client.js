import IoRedis from 'ioredis'

import config from '../../config'

/**
 * Setup Redis and provide a redis client
 *
 * Local development - 1 Redis instance
 * Out in the wild - Elasticache / Redis Cluster with username and password
 *
 * @returns {Cluster | Redis}
 */
function buildRedisClient() {
  const port = 6379
  const db = 0
  let redisClient

  if (config.useSingleInstanceCache) {
    redisClient = new IoRedis({
      port,
      host: config.redisHost,
      db
    })
  } else {
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
    console.log('Connected to Redis server')
  })

  redisClient.on('close', () => {
    console.log('Redis connection closed attempting reconnect')
    redisClient.connect()
  })

  redisClient.on('error', (error) => {
    console.log(`Redis connection error ${error}`)
  })

  return redisClient
}

export { buildRedisClient }
