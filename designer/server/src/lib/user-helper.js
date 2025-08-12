/**
 *
 * @param { Partial<UserCredentials> | undefined } user
 * @returns {UserCredentials}
 */
export function mapUserForAudit(user) {
  return /** @type {UserCredentials} */ ({
    id: user?.id,
    displayName: user?.displayName,
    email: user?.email
  })
}

/**
 * @import { UserCredentials } from '@hapi/hapi'
 */
