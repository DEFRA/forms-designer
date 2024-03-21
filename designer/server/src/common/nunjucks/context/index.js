import { readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'

import config from '../../../config'
import { createLogger } from '../../helpers/logging/logger'

import { buildNavigation } from './build-navigation'

const logger = createLogger()
const { appPathPrefix, isDevelopment, serviceName } = config

const distPath = isDevelopment
  ? resolve(cwd(), '../dist') // npm run dev
  : resolve(cwd()) // npm run build

let webpackManifest

async function context(request) {
  const assetsPath = resolve(distPath, '../../client/dist/assets')
  const manifestPath = join(assetsPath, 'manifest.json')

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
