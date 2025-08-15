import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType
} from '@defra/forms-model'

/**
 * @param {AuditUser} user
 * @returns {AuthenticationLoginMessage}
 */
export function authenticationBaseMapper(user) {
  /** @type {AuthenticationMessageData} */
  const data = {
    userId: user.id,
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
 * @param {AuditUser} user
 * @returns {AuthenticationLoginMessage}
 */
export function authenticationLoginMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGIN
  }
}

/**
 * @param {AuditUser} user
 * @returns {AuthenticationLogoutManualMessage}
 */
export function authenticationLogoutManualMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL
  }
}

/**
 * @param {AuditUser} user
 * @returns {AuthenticationLogoutAutoMessage}
 */
export function authenticationLogoutAutoMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO
  }
}

/**
 * @param {AuditUser} user
 * @returns {AuthenticationLogoutDifferentDeviceMessage}
 */
export function authenticationLogoutDifferentDevicelMapper(user) {
  return {
    ...authenticationBaseMapper(user),
    type: AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE
  }
}

/**
 * @param {FormDownloadData} downloadData
 * @returns {FormDownloadedMessage}
 */
export function formDownloadedMapper(downloadData) {
  const { formId, slug, user } = downloadData
  const now = new Date()

  return {
    schemaVersion: AuditEventMessageSchemaVersion.V1,
    category: AuditEventMessageCategory.FORM,
    source: AuditEventMessageSource.FORMS_DESIGNER,
    type: AuditEventMessageType.FORM_JSON_DOWNLOADED,
    entityId: formId,
    createdAt: now,
    createdBy: {
      id: user.id,
      displayName: user.displayName
    },
    data: {
      formId,
      slug
    },
    messageCreatedAt: now
  }
}

/**
 * @typedef {object} FormDownloadData
 * @property {string} formId - The form ID
 * @property {string} slug - The form slug
 * @property {AuditUser} user - The user downloading the form
 */

/**
 * @import { AuditUser, AuthenticationLoginMessage, AuthenticationLogoutAutoMessage, AuthenticationLogoutDifferentDeviceMessage, AuthenticationLogoutManualMessage, AuthenticationMessageData, FormDownloadedMessage } from '@defra/forms-model'
 */
