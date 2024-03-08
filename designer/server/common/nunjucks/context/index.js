import path from 'path'

import config from '../../../config'
import { createLogger } from '../../../common/helpers/logging/logger'
import { buildNavigation } from '../../../common/nunjucks/context/build-navigation'

import * as fs from 'fs'

const logger = createLogger()
const assetPath = config.assetPath
const appPathPrefix = config.appPathPrefix

// const manifestPath = path.resolve(
//   path.normalize(path.join(__dirname, '..', '..')),
//   'dist',
//   'client',
//   'assets',
//   'manifest.json'
// )

const manifestPath = path.resolve(
  path.normalize(path.join(__dirname, 'client', 'assets', 'manifest.json'))
)

let webpackManifest

try {
  // webpackManifest = require(manifestPath)
  webpackManifest = JSON.parse(fs.readFileSync(manifestPath).toString())
} catch (error) {
  logger.error('Webpack Manifest assets file not found')
}

async function context(request) {
  const authedUser = await request.getUserSession()

  return {
    serviceName: config.serviceName,
    breadcrumbs: [],
    appPathPrefix: config.appPathPrefix,
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${appPathPrefix}/assets/${webpackAssetPath}`
    },
    legacyAssetPath: `${config.appPathPrefix}/assets`,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    authedUser
  }
}

export { context }
