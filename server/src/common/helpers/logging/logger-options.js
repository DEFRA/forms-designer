import { getTraceId } from '@defra/hapi-tracing'
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
  mixin() {
    const mixinValues = {}
    const traceId = getTraceId()
    if (traceId) {
      mixinValues.trace = { id: traceId }
    }
    return mixinValues
  }
}

/**
 * @import { Options } from 'hapi-pino'
 * @import { LoggerOptions, TransportSingleOptions } from 'pino'
 */
