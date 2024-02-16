import hapiPino from 'hapi-pino'

import { loggerOptions } from './logger-options'

const requestLogger = {
  plugin: hapiPino,
  options: loggerOptions
}

export { requestLogger }
