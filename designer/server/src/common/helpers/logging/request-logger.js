import hapiPino from 'hapi-pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options'

const requestLogger = {
  plugin: hapiPino,
  options: loggerOptions
}

export { requestLogger }
