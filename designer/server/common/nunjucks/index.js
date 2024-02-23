import path from 'path'
import nunjucks from 'nunjucks'
import hapiVision from '@hapi/vision'

import config from '../../config'
import { context } from './context'
import * as filters from './filters'
import * as globals from './globals'

const nunjucksEnvironment = nunjucks.configure(
  [
    // bodge for legacy views. TODO replace.
    // always make sure this is first so it this generated file takes precedence over the static files
    path.normalize(
      path.resolve(__dirname, '..', 'dist', 'client', 'common', 'templates')
    ),
    path.normalize(
      path.resolve(__dirname, '..', '..', 'node_modules', 'govuk-frontend')
    ),
    path.normalize(
      path.resolve(__dirname, '..', 'server', 'common', 'templates')
    ),
    path.normalize(
      path.resolve(__dirname, '..', 'server', 'common', 'components')
    )
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
    relativeTo: path.normalize(path.resolve(__dirname, '..', 'server', 'views')),
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
