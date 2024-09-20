import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

import upperFirst from 'lodash/upperFirst.js'

import { SCOPE_READ } from '~/src/common/constants/scopes.js'
import { getUserSession } from '~/src/common/helpers/auth/get-user-session.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'

const logger = createLogger()
const { phase, serviceName, env, isTest, isProduction } = config

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

  let tagColour = 'grey'

  if (isTest) {
    tagColour = 'yellow'
  } else if (isProduction) {
    tagColour = 'red'
  }

  const envTag = {
    text: upperFirst(env),
    classes: `govuk-tag--${tagColour}`
  }

  return {
    envTag,
    breadcrumbs: [],
    config: {
      phase,
      serviceName
    },
    navigation: buildNavigation(request),
    getAssetPath: (asset = '') => `/${webpackManifest?.[asset] ?? asset}`,
    assetPath: '/assets',
    isAuthenticated: request?.auth?.isAuthenticated ?? false,
    isAuthorized: request?.auth?.isAuthorized ?? false,
    isFormsUser: credentials?.scope?.includes(SCOPE_READ) ?? false, // isAuthorized may be true if no scopes are required for the route
    authedUser: credentials?.user
  }
}

/**
 * @import { Request } from '@hapi/hapi'
 */
