import hapiPino from 'hapi-pino'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

/**
 * @satisfies {ServerRegisterPluginObject<Options>}
 */
export const requestLogger = {
  plugin: hapiPino,
  options: loggerOptions
}

/**
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */

/**
 * @typedef {import('hapi-pino').Options} Options
 */
