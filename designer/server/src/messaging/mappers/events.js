import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType
} from '@defra/forms-model'

import config from '~/src/config.js'

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
 * @param {{ fileId: string, filename: string, user: AuditUser }} data
 * @param {boolean} isSuccess
 * @returns { FormFileDownloadSuccessMessage | FormFileDownloadFailureMessage }
 */
export function formFileDownloadedMapper(data, isSuccess) {
  const { fileId, user } = data
  const now = new Date()

  return {
    schemaVersion: AuditEventMessageSchemaVersion.V1,
    category: AuditEventMessageCategory.FORM,
    source: AuditEventMessageSource.FORMS_DESIGNER,
    type: isSuccess
      ? AuditEventMessageType.FORM_FILE_DOWNLOAD_SUCCESS
      : AuditEventMessageType.FORM_FILE_DOWNLOAD_FAILURE,
    entityId: fileId,
    createdAt: now,
    createdBy: {
      id: user.id,
      displayName: user.displayName
    },
    data: {
      fileId,
      filename: data.filename,
      fileLink: `${config.appBaseUrl}/file-download/${fileId}`
    },
    messageCreatedAt: now
  }
}

/**
 * Base mapper for Excel generation events
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 * @param {AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED | AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED | AuditEventMessageType.PLATFORM_CSAT_EXCEL_REQUESTED} type
 * @returns {FormSubmissionExcelRequestedMessage | FormCsatExcelRequestedMessage | PlatformCsatExcelRequestedMessage}
 */
function excelGenerationBaseMapper(data, user, type) {
  const now = new Date()
  const { formId, formName, notificationEmail } = data

  return {
    schemaVersion: AuditEventMessageSchemaVersion.V1,
    category: AuditEventMessageCategory.FORM,
    source: AuditEventMessageSource.FORMS_DESIGNER,
    type,
    entityId: formId,
    createdAt: now,
    createdBy: {
      id: user.id,
      displayName: user.displayName
    },
    data: {
      formId,
      formName,
      notificationEmail
    },
    messageCreatedAt: now
  }
}

/**
 * Mapper for form submission Excel requested event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 * @returns {FormSubmissionExcelRequestedMessage}
 */
export function formSubmissionExcelRequestedMapper(data, user) {
  return /** @type {FormSubmissionExcelRequestedMessage} */ (
    excelGenerationBaseMapper(
      data,
      user,
      AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED
    )
  )
}

/**
 * Mapper for form CSAT Excel requested event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 * @returns {FormCsatExcelRequestedMessage}
 */
export function formCsatExcelRequestedMapper(data, user) {
  return /** @type {FormCsatExcelRequestedMessage} */ (
    excelGenerationBaseMapper(
      data,
      user,
      AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
    )
  )
}

/**
 * Mapper for platform CSAT Excel requested event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 * @returns {PlatformCsatExcelRequestedMessage}
 */
export function platformCsatExcelRequestedMapper(data, user) {
  return /** @type {PlatformCsatExcelRequestedMessage} */ (
    excelGenerationBaseMapper(
      data,
      user,
      AuditEventMessageType.PLATFORM_CSAT_EXCEL_REQUESTED
    )
  )
}

/**
 * @typedef {object} FormDownloadData
 * @property {string} formId - The form ID
 * @property {string} slug - The form slug
 * @property {AuditUser} user - The user downloading the form
 */

/**
 * @typedef {object} ExcelGenerationData
 * @property {string} formId - The form ID (or 'platform' for platform-wide)
 * @property {string} formName - The form name (or 'all' for platform-wide)
 * @property {string} notificationEmail - The email address to send the download link
 */

/**
 * @import { AuditUser, AuthenticationLoginMessage, AuthenticationLogoutAutoMessage, AuthenticationLogoutDifferentDeviceMessage, AuthenticationLogoutManualMessage, AuthenticationMessageData, FormDownloadedMessage, FormFileDownloadFailureMessage, FormFileDownloadSuccessMessage, FormSubmissionExcelRequestedMessage, FormCsatExcelRequestedMessage, PlatformCsatExcelRequestedMessage } from '@defra/forms-model'
 */
