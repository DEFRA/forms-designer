import Boom from '@hapi/boom'

/**
 *
 * @param { Partial<UserCredentials> | undefined } user
 * @returns {AuditUser}
 */
export function mapUserForAudit(user) {
  if (!user) {
    throw Boom.badRequest('Missing user for auditing')
  }

  return /** @type {AuditUser} */ ({
    id: user.id,
    displayName: user.displayName
  })
}

/**
 * @param {{ credentials?: { scope?: string[] }}} [auth]
 */
export function getUserScopes(auth) {
  return auth?.credentials?.scope ?? []
}

/**
 * @import { AuditUser } from '@defra/forms-model'
 * @import { UserCredentials } from '@hapi/hapi'
 */
