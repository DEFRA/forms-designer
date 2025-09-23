import { mapScopesToRoles } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { getUser } from '~/src/lib/manage.js'

const logger = createLogger()

/**
 * Refreshes user session entitlements and patches the current request if it's the same user
 * @template {Request} T
 * @param {T} request
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<string[] | undefined>} The updated scopes
 */
export async function refreshUserSessionEntitlements(request, userId, token) {
  const { server } = request

  try {
    const existingSession = await server.methods.session.get(userId)

    if (!existingSession) {
      logger.info(`No session found for user ${userId}, nothing to refresh`)
      return undefined
    }

    try {
      const entitlementUser = await getUser(token, userId)

      if (existingSession.user) {
        existingSession.user.roles = entitlementUser.roles
      }

      existingSession.scope =
        entitlementUser.roles.length > 0
          ? mapScopesToRoles(/** @type {Roles[]} */ (entitlementUser.roles))
          : []

      await server.methods.session.set(userId, existingSession)

      if (request.auth.credentials.user?.id === userId) {
        request.auth.credentials.scope = existingSession.scope
        request.auth.credentials.user.roles = entitlementUser.roles // hapi doesn't user this, however for consistency we'll keep it
      }

      logger.info(`Successfully refreshed entitlements for user ${userId}`)

      return existingSession.scope
    } catch (err) {
      logger.error(
        err,
        `Failed to fetch entitlements for user ${userId}, dropping session`
      )
      await server.methods.session.drop(userId)
      throw err
    }
  } catch (err) {
    logger.error(
      err,
      `Error refreshing session entitlements for user ${userId}`
    )
    throw err
  }
}

/**
 * @import { Request } from '@hapi/hapi'
 * @import { Roles } from '@defra/forms-model'
 */
