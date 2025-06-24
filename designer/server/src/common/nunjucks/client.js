/* istanbul ignore file */
/* eslint-disable */
import { dirname, join } from 'node:path'

import nunjucks from 'nunjucks'
import resolvePkg from 'resolve'

import config from '~/src/config.js'

export const nunjucksClientEnvironment = nunjucks.configure(
  [
    join(config.clientSrc, 'views/components'),
    join(config.clientSrc, 'views'),
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

// @ts-expect-error
for (const [name, nunjucksGlobal] of Object.entries(globals)) {
  nunjucksClientEnvironment.addGlobal(name, nunjucksGlobal)
}

// @ts-expect-error
for (const [name, nunjucksFilter] of Object.entries(filters)) {
  nunjucksClientEnvironment.addFilter(name, nunjucksFilter)
}
