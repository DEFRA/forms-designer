import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

import { Scopes } from '@defra/forms-model'

import {
  getUserSession,
  hasAdminRole
} from '~/src/common/helpers/auth/get-user-session.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import {
  buildFormUrl,
  buildPreviewUrl
} from '~/src/models/forms/editor-v2/common.js'

const logger = createLogger()
const { cdpEnvironment, phase, serviceName, serviceVersion } = config

/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * @param {Partial<Request> | null} request
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

  const isAdmin = credentials?.user && hasAdminRole(credentials.user)

  return {
    breadcrumbs: [],
    config: {
      cdpEnvironment,
      phase,
      serviceName,
      serviceVersion,
      featureFlagUseEntitlementApi: config.featureFlagUseEntitlementApi
    },
    navigation: buildNavigation(request),
    getAssetPath: (asset = '') => `/${webpackManifest?.[asset] ?? asset}`,
    assetPath: '/assets',
    isAuthenticated: request?.auth?.isAuthenticated ?? false,
    isAuthorized: request?.auth?.isAuthorized ?? false,
    isFormsUser: credentials?.scope?.includes(Scopes.FormRead) ?? false, // isAuthorized may be true if no scopes are required for the route
    authedUser: credentials?.user,
    isAdmin,
    helpers: {
      buildFormUrl,
      buildPreviewUrl
    }
  }
}

/**
 * @import { Request } from '@hapi/hapi'
 */
