import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

import { getErrorMessage } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { SCOPE_READ } from '~/src/common/constants/scopes.js'
import {
  getUserSession,
  hasAdminRole
} from '~/src/common/helpers/auth/get-user-session.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import { getUser } from '~/src/lib/manage.js'
import {
  buildFormUrl,
  buildPreviewUrl
} from '~/src/models/forms/editor-v2/common.js'

const logger = createLogger()
const { cdpEnvironment, phase, serviceName, serviceVersion } = config

/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * Handle errors from the entitlement API
 * @param {unknown} error
 */
export function handleEntitlementApiError(error) {
  const errorMessage = getErrorMessage(error)

  // @ts-expect-error -- Boom errors have output.statusCode and isBoom property
  const statusCode = error?.output?.statusCode
  // @ts-expect-error -- Boom errors have isBoom property
  const isBoomError = error?.isBoom === true

  if (
    statusCode === StatusCodes.UNAUTHORIZED ||
    statusCode === StatusCodes.FORBIDDEN
  ) {
    logger.error(
      `Authentication/authorisation error fetching user details (${statusCode}):`,
      errorMessage
    )
  } else if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR || !isBoomError) {
    const statusInfo = statusCode ? ` (${statusCode})` : ''
    logger.error(
      `Failed to fetch user details from entitlement API${statusInfo}:`,
      errorMessage
    )
  } else {
    logger.warn(
      `Unexpected response fetching user details (${statusCode}):`,
      errorMessage
    )
  }
}

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

  let userDetails = null
  let isAdmin = false

  if (credentials?.user?.id && credentials.token) {
    try {
      userDetails = await getUser(credentials.token, credentials.user.id)
      isAdmin = hasAdminRole(userDetails)
    } catch (error) {
      handleEntitlementApiError(error)
    }
  }

  return {
    breadcrumbs: [],
    config: {
      cdpEnvironment,
      phase,
      serviceName,
      serviceVersion
    },
    navigation: buildNavigation(request),
    getAssetPath: (asset = '') => `/${webpackManifest?.[asset] ?? asset}`,
    assetPath: '/assets',
    isAuthenticated: request?.auth?.isAuthenticated ?? false,
    isAuthorized: request?.auth?.isAuthorized ?? false,
    isFormsUser: credentials?.scope?.includes(SCOPE_READ) ?? false, // isAuthorized may be true if no scopes are required for the route
    authedUser: credentials?.user,
    userDetails,
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
