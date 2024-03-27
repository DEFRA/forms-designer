import ecsFormat from '@elastic/ecs-pino-format'

import config from '~/src/config'

const loggerOptions = {
  enabled: !config.isTest,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  },
  level: config.logLevel,
  ...(config.isDevelopment
    ? { transport: { target: 'pino-pretty' } }
    : ecsFormat())
}

export { loggerOptions }
