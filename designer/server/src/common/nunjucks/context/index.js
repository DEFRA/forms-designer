import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

import { getUserSession } from '~/src/common/helpers/auth/get-user-session.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'

const logger = createLogger()
const { phase, serviceName } = config

/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * @param {Request | null} request
 */
export async function context(request) {
  const manifestPath = join(config.clientDir, 'assets-manifest.json')

  if (!webpackManifest) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allow JSON type 'any'
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch {
      logger.error(`Webpack assets ${basename(manifestPath)} file not found`)
    }
  }

  const credentials = request ? await getUserSession(request) : undefined

  return {
    breadcrumbs: [],
    config: {
      phase,
      serviceName
    },
    navigation: buildNavigation(request),
    getAssetPath: (asset = '') => `/${webpackManifest?.[asset] ?? asset}`,
    assetPath: '/assets',
    isAuthenticated: request?.auth.isAuthenticated ?? false,
    authedUser: credentials?.user
  }
}

/**
 * @import { Request } from '@hapi/hapi'
 */
