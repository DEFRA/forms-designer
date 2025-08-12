import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType
} from '@defra/forms-model'

/**
 * @param {UserCredentials} user
 * @returns {AuthenticationLoginMessage}
 */
export function authenticationBaseMapper(user) {
  /** @type {AuthenticationMessageData} */
  const data = {
    userId: user.id,
    email: user.email ?? 'unknown@notfound.com',
    displayName: user.displayName
  }
  const now = new Date()
  return {
    schemaVersion: AuditEventMessageSchemaVersion.V1,
    category: AuditEventMessageCategory.AUTHENTICATION,
    source: AuditEventMessageSource.AUTHENTICATION,
    type: AuditEventMessageType.AUTHENTICATION_LOGIN,
    entityId: data.userId,
    createdAt: now,
    createdBy: {
      id: data.userId,
      displayName: data.displayName
    },
    data,
    messageCreatedAt: now
  }
}

/**
 * @param {UserCredentials} user
 * @returns {AuthenticationLoginMessage}
 */
export function authenticationLoginMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGIN
  }
}

/**
 * @param {UserCredentials} user
 * @returns {AuthenticationLogoutManualMessage}
 */
export function authenticationLogoutManualMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL
  }
}

/**
 * @param {UserCredentials} user
 * @returns {AuthenticationLogoutAutoMessage}
 */
export function authenticationLogoutAutoMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO
  }
}

/**
 * @param {UserCredentials} user
 * @returns {AuthenticationLogoutDifferentDeviceMessage}
 */
export function authenticationLogoutDifferentDevicelMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE
  }
}

/**
 * @import { AuthenticationLoginMessage, AuthenticationLogoutAutoMessage, AuthenticationLogoutDifferentDeviceMessage, AuthenticationLogoutManualMessage, AuthenticationMessageData } from '@defra/forms-model'
 * @import { UserCredentials } from '@hapi/hapi'
 */
