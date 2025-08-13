import {
  dropUserSessionById,
  refreshUserSessionEntitlements
} from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as lib from '~/src/lib/manage.js'

const logger = createLogger()

/**
 * @param {string} token
 * @param {{ email: string, roles: string[] }} userDetails
 * @returns {Promise<{ emailAddress: string, userRole: string, displayName: string }>}
 */
export async function addUser(token, userDetails) {
  logger.info(`Adding new user with email: ${userDetails.email}`)

  const newUser = await lib.addUser(token, userDetails)

  return newUser
}

/**
 * @param {Server} server
 * @param {string} token
 * @param {{ userId: string, roles: string[] }} userDetails
 * @returns {Promise<{ userId: string, userRole: string }>}
 */
export async function updateUser(server, token, userDetails) {
  logger.info(
    `Updating user ${userDetails.userId} with roles: ${userDetails.roles.join(', ')}`
  )

  const updatedUser = await lib.updateUser(token, userDetails)

  await refreshUserSessionEntitlements(server, userDetails.userId, token)

  return updatedUser
}

/**
 * @param {Server} server
 * @param {string} token
 * @param {string} userId
 */
export async function deleteUser(server, token, userId) {
  logger.info(`Deleting user ${userId}`)

  await lib.deleteUser(token, userId)

  await dropUserSessionById(server, userId)
}

/**
 * @import { Server } from '@hapi/hapi'
 */
