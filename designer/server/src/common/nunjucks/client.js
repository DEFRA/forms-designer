import { dirname, join } from 'node:path'

import nunjucks from 'nunjucks'
import resolvePkg from 'resolve'

import config from '~/src/config.js'

export const nunjucksClientEnvironment = nunjucks.configure(
  [
    join(config.clientSrc, 'views/components'),
    join(dirname(resolvePkg.sync('govuk-frontend/package.json')), 'dist')
  ],
  {
    trimBlocks: true,
    lstripBlocks: true,
    watch: config.isDevelopment,
    noCache: config.isDevelopment,
    web: {
      useCache: config.isDevelopment
    }
  }
)
/* global globals, filters */
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
for (const [name, nunjucksGlobal] of Object.entries(globals)) {
  nunjucksClientEnvironment.addGlobal(name, nunjucksGlobal)
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
for (const [name, nunjucksFilter] of Object.entries(filters)) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  nunjucksClientEnvironment.addFilter(name, nunjucksFilter)
}
