import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'

const logger = createLogger()
const { appPathPrefix, serviceName } = config

/** @type {Record<string, string> | undefined} */
let webpackManifest

async function context(request) {
  const manifestPath = join(config.clientDir, 'assets-manifest.json')

  if (!webpackManifest) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allow JSON type 'any'
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch {
      logger.error(`Webpack assets ${basename(manifestPath)} file not found`)
    }
  }

  const authedUser = await request.getUserSession()

  return {
    serviceName,
    breadcrumbs: [],
    appPathPrefix,
    navigation: buildNavigation(request),
    getAssetPath: (asset = '') =>
      `${appPathPrefix}/${webpackManifest?.[asset] ?? asset}`,
    assetPath: `${appPathPrefix}/assets`,
    legacyAssetPath: `${appPathPrefix}/assets`,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    authedUser
  }
}

export { context }
