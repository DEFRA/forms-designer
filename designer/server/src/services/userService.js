import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import { refreshUserSessionEntitlements } from '~/src/common/helpers/auth/refresh-user-session-entitlements.js'
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
 * Updates a user and refreshes their session entitlements
 * @template {Request} T
 * @param {T} request
 * @param {{ userId: string, roles: string[] }} userDetails
 * @returns {Promise<{ updatedUser: { userId: string, userRole: string }, newScopes: string[] | undefined }>}
 */
export async function updateUser(request, userDetails) {
  const { auth } = request
  const { token } = auth.credentials

  logger.info(
    `Updating user ${userDetails.userId} with roles: ${userDetails.roles.join(', ')}`
  )

  const updatedUser = await lib.updateUser(token, userDetails)

  const newScopes = await refreshUserSessionEntitlements(
    request,
    userDetails.userId,
    token
  )

  return {
    updatedUser,
    newScopes
  }
}

/**
 * Checks if a user still has admin role after a role change
 * @template {Request} T
 * @param {T} request
 * @returns {boolean} Whether the user still has admin role
 */
export function checkCanAccessUserManagement(request) {
  const { credentials } = request.auth
  return hasAdminRole(credentials.user)
}

/**
 * Deletes a user and handles session cleanup
 * @template {Request} T
 * @param {T} request
 * @param {string} userId
 * @returns {Promise<boolean>} Whether it was a self-deletion
 */
export async function deleteUser(request, userId) {
  const { server, auth, cookieAuth } = request
  const { token, user } = auth.credentials
  const isSelfDeletion = user?.id === userId

  logger.info(`Deleting user ${userId}`)

  await lib.deleteUser(token, userId)

  try {
    await server.methods.session.drop(userId)
  } catch (err) {
    logger.error(err, `Error dropping session for user ${userId}`)
  }

  if (isSelfDeletion) {
    cookieAuth.clear()
  }

  return isSelfDeletion
}

/**
 * @import { Request } from '@hapi/hapi'
 */
