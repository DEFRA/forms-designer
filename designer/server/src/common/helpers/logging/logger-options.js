import { ecsFormat } from '@elastic/ecs-pino-format'

import config from '~/src/config.js'

/**
 * @satisfies {LoggerOptions}
 */
export const loggerOptions = {
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  },
  level: config.logLevel,
  ...(config.isDevelopment
    ? /** @type {LoggerTransport} */ ({ transport: { target: 'pino-pretty' } })
    : /** @type {LoggerFormat} */ (ecsFormat()))
}

/**
 * @typedef {import('pino').LoggerOptions} LoggerOptions
 * @typedef {{ transport: import('pino').TransportSingleOptions }} LoggerTransport
 * @typedef {Pick<LoggerOptions, 'messageKey' | 'timestamp' | 'formatters'>} LoggerFormat
 */
