import { pino } from 'pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

export const logger = pino(loggerOptions)
