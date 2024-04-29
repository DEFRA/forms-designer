import { join } from 'node:path'

import hapiVision from '@hapi/vision'
import nunjucks from 'nunjucks'

import { environment } from './environment.js'

import { context } from '~/src/common/nunjucks/context/index.js'
import config from '~/src/config.js'

export const plugin = {
  plugin: hapiVision,
  options: {
    engines: {
      njk: {
        /**
         * @param {string} path
         * @param {{ environment: typeof environment }} options
         * @returns {(options: ReturnType<Awaited<typeof context>>) => string}
         */
        compile(path, { environment }) {
          return (options) =>
            nunjucks.compile(path, environment).render(options)
        }
      }
    },
    compileOptions: { environment },
    relativeTo: join(config.appDir, 'routes'),
    isCached: config.isProduction,
    context
  }
}
