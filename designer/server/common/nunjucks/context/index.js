import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'

import config from '../../../config'
import { createLogger } from '../../../common/helpers/logging/logger'
import { buildNavigation } from '../../../common/nunjucks/context/build-navigation'

const logger = createLogger()
const { appPathPrefix, isDevelopment, serviceName } = config

const distPath = isDevelopment
  ? resolve(cwd(), 'dist') // npm run dev
  : resolve(cwd()) // npm run build

let webpackManifest

async function context(request) {
  const manifestPath = resolve(distPath, 'client/assets/manifest.json')

  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath))
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
    getAssetPath: (asset) =>
      `${appPathPrefix}/${webpackManifest?.[asset] ?? asset}`,
    legacyAssetPath: `${appPathPrefix}/assets`,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    authedUser
  }
}

export { context }
