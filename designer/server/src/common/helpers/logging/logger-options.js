import { ecsFormat } from '@elastic/ecs-pino-format'

import config from '~/src/config.js'

/**
 * @satisfies {Options}
 */
export const loggerOptions = {
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  },
  level: config.logLevel,
  ...(config.isDevelopment
    ? { transport: { target: 'pino-pretty' } }
    : /** @type {Omit<LoggerOptions, 'mixin' | 'transport'>} */ (ecsFormat()))
}

/**
 * @import { Options } from 'hapi-pino'
 * @import { LoggerOptions } from 'pino'
 */
