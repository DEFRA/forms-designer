import { pino } from 'pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

/**
 * @returns {import('pino').Logger}
 */
export function createLogger() {
  return pino(loggerOptions)
}
