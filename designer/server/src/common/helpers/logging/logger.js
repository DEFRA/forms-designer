import { pino } from 'pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

/**
 * @returns {Logger}
 */
export function createLogger() {
  return pino(loggerOptions)
}

/**
 * @import { Logger } from 'pino'
 */
