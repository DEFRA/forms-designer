import { dirname, join } from 'node:path'

import nunjucks from 'nunjucks'
import resolvePkg from 'resolve'

import * as filters from '~/src/common/nunjucks/filters/index.js'
import * as globals from '~/src/common/nunjucks/globals.js'
import config from '~/src/config.js'

export const environment = nunjucks.configure(
  [
    join(config.appDir, 'views'),
    join(config.appDir, 'common/templates'),
    join(config.appDir, 'common/components'),
    join(dirname(resolvePkg.sync('govuk-frontend/package.json')), 'dist')
  ],
  {
    trimBlocks: true,
    lstripBlocks: true,
    watch: config.isDevelopment,
    noCache: config.isDevelopment
  }
)

for (const [name, nunjucksGlobal] of Object.entries(globals)) {
  environment.addFilter(name, nunjucksGlobal)
}

for (const [name, nunjucksFilter] of Object.entries(filters)) {
  environment.addFilter(name, nunjucksFilter)
}
