import { ecsFormat } from '@elastic/ecs-pino-format'

import config from '~/src/config.js'

/**
 * @type {import('pino').LoggerOptions}
 */
export const loggerOptions = {
  enabled: !config.isTest,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  },
  level: config.logLevel,
  ...(config.isProduction
    ? ecsFormat()
    : {
        transport: {
          target: 'pino-pretty'
        }
      })
}
