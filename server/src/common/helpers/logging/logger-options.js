import { addLogContextToMessage, logContextMixin } from '@defra/forms-common'
import { ecsFormat } from '@elastic/ecs-pino-format'

import config from '~/src/config.js'

const logConfig = config.log
const serviceName = config.serviceName
const serviceVersion = config.serviceVersion

const formatters = {
  ecs: /** @type {Omit<LoggerOptions, 'mixin' | 'transport'>} */ ({
    ...ecsFormat({
      serviceVersion,
      serviceName
    })
  }),
  'pino-pretty': /** @type {{ transport: TransportSingleOptions }} */ ({
    transport: {
      target: 'pino-pretty'
    }
  })
}

/**
 * @satisfies {Options}
 */
export const loggerOptions = {
  enabled: logConfig.enabled,
  ignorePaths: ['/health'],
  redact: {
    paths: logConfig.redact,
    remove: true
  },
  level: logConfig.level,
  ...formatters[logConfig.format],
  mixin: logContextMixin,
  hooks: {
    logMethod: addLogContextToMessage
  }
}

/**
 * @import { Options } from 'hapi-pino'
 * @import { LoggerOptions, TransportSingleOptions } from 'pino'
 */
