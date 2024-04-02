import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'

import hapiVision from '@hapi/vision'
import nunjucks from 'nunjucks'
import resolvePkg from 'resolve/sync'

import config from '~/src/config'
import { context } from '~/src/common/nunjucks/context'
import * as filters from '~/src/common/nunjucks/filters'
import * as globals from '~/src/common/nunjucks/globals'

const distPath = config.isDevelopment
  ? resolve(cwd(), '../dist') // npm run dev
  : resolve(cwd()) // npm run build

const nunjucksEnvironment = nunjucks.configure(
  [
    resolve(distPath, 'common/templates'),
    resolve(distPath, 'common/components'),
    dirname(resolvePkg('govuk-frontend/package.json'))
  ],
  {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
    watch: config.isDevelopment,
    noCache: config.isDevelopment
  }
)

const nunjucksConfig = {
  plugin: hapiVision,
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return (context) => template.render(context)
        }
      }
    },
    compileOptions: {
      environment: nunjucksEnvironment
    },
    relativeTo: resolve(cwd(), 'views'),
    isCached: config.isProduction,
    context
  }
}

Object.keys(globals).forEach((global) => {
  nunjucksEnvironment.addFilter(global, globals[global])
})

Object.keys(filters).forEach((filter) => {
  nunjucksEnvironment.addFilter(filter, filters[filter])
})

export { nunjucksConfig }
