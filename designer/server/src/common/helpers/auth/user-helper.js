/**
 *
 * @param { Partial<UserCredentials> | undefined } user
 * @returns {AuditUser}
 */
export function mapUserForAudit(user) {
  return /** @type {AuditUser} */ ({
    id: user?.id,
    displayName: user?.displayName
  })
}

/**
 * @import { AuditUser } from '@defra/forms-model'
 * @import { UserCredentials } from '@hapi/hapi'
 */
