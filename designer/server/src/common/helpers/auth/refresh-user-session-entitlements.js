import { mapScopesToRoles } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { getUser } from '~/src/lib/manage.js'

const logger = createLogger()

/**
 * @param {Server} server
 * @param {string} userId
 * @param {string} token
 */
export async function refreshUserSessionEntitlements(server, userId, token) {
  try {
    const existingSession = await server.methods.session.get(userId)

    if (!existingSession) {
      logger.info(`No session found for user ${userId}, nothing to refresh`)
      return
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

      logger.info(`Successfully refreshed entitlements for user ${userId}`)
    } catch (error) {
      logger.warn(
        `Failed to fetch entitlements for user ${userId}, dropping session`,
        error
      )
      await server.methods.session.drop(userId)
    }
  } catch (error) {
    logger.error(
      `Error refreshing session entitlements for user ${userId}`,
      error
    )
    throw error
  }
}

/**
 * @param {Server} server
 * @param {string} userId
 */
export async function dropUserSessionById(server, userId) {
  try {
    await server.methods.session.drop(userId)
    logger.info(`Successfully dropped session for user ${userId}`)
  } catch (error) {
    logger.error(`Error dropping session for user ${userId}`, error)
  }
}

/**
 * @import { Server } from '@hapi/hapi'
 * @import { Roles } from '@defra/forms-model'
 */
