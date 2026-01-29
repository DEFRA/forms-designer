import { messageSchema } from '@defra/forms-model'
import Joi from 'joi'

import {
  authenticationLoginMapper,
  authenticationLogoutAutoMapper,
  authenticationLogoutDifferentDevicelMapper,
  authenticationLogoutManualMapper,
  formCsatExcelRequestedMapper,
  formDownloadedMapper,
  formFileDownloadedMapper,
  formSubmissionExcelRequestedMapper,
  formsBackupRequestedMapper,
  platformCsatExcelRequestedMapper
} from '~/src/messaging/mappers/events.js'
import { publishEvent } from '~/src/messaging/publish-base.js'

/**
 * Helper to validate and publish an event
 * @param {AuditMessage} auditMessage
 */
async function validateAndPublishEvent(auditMessage) {
  const value = Joi.attempt(auditMessage, messageSchema, {
    abortEarly: false
  })

  return publishEvent(value)
}

/**
 * Publish authentication 'login' event
 * @param {AuditUser} user
 */
export async function publishAuthenticationLoginEvent(user) {
  const auditMessage = authenticationLoginMapper(user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish authentication 'manual logout' event
 * @param {AuditUser} user
 */
export async function publishAuthenticationLogoutManualEvent(user) {
  const auditMessage = authenticationLogoutManualMapper(user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish authentication 'auto logout' event
 * @param {AuditUser} user
 */
export async function publishAuthenticationLogoutAutoEvent(user) {
  const auditMessage = authenticationLogoutAutoMapper(user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish authentication 'logout due to login on different device' event
 * @param {AuditUser} user
 */
export async function publishAuthenticationLogoutDifferentDeviceEvent(user) {
  const auditMessage = authenticationLogoutDifferentDevicelMapper(user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish form 'JSON downloaded' event
 * @param {string} formId - The form ID
 * @param {string} slug - The form slug
 * @param {AuditUser} user - The user downloading the form
 */
export async function publishFormDownloadedEvent(formId, slug, user) {
  const auditMessage = formDownloadedMapper({ formId, slug, user })

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish form 'JSON downloaded successful' event
 * @param {string} fileId - The file ID
 * @param {string} filename - The filename
 * @param {AuditUser} user - The user downloading the form
 */
export async function publishFormFileDownloadSuccessEvent(
  fileId,
  filename,
  user
) {
  const auditMessage = formFileDownloadedMapper(
    { fileId, filename, user },
    true
  )

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish form 'JSON downloaded failure' event
 * @param {string} fileId - The file ID
 * @param {string} filename - The filename
 * @param {AuditUser} user - The user downloading the form
 */
export async function publishFormFileDownloadFailureEvent(
  fileId,
  filename,
  user
) {
  const auditMessage = formFileDownloadedMapper(
    { fileId, filename, user },
    false
  )

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish 'form submission excel requested' event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 */
export async function publishFormSubmissionExcelRequestedEvent(data, user) {
  const auditMessage = formSubmissionExcelRequestedMapper(data, user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish 'form CSAT excel requested' event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 */
export async function publishFormCsatExcelRequestedEvent(data, user) {
  const auditMessage = formCsatExcelRequestedMapper(data, user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish 'platform CSAT excel requested' event
 * @param {ExcelGenerationData} data
 * @param {AuditUser} user
 */
export async function publishPlatformCsatExcelRequestedEvent(data, user) {
  const auditMessage = platformCsatExcelRequestedMapper(data, user)

  return validateAndPublishEvent(auditMessage)
}

/**
 * Publish 'forms backup requested' event
 * @param {AuditUser} user - The user requesting the backup
 * @param {number} totalForms - The total number of forms being backed up
 * @param {number} durationMs - How long the backup took in milliseconds
 */
export async function publishFormsBackupRequestedEvent(
  user,
  totalForms,
  durationMs
) {
  const auditMessage = formsBackupRequestedMapper(
    { totalForms, durationMs },
    user
  )
  return validateAndPublishEvent(auditMessage)
}

/**
 * @import { AuditMessage, AuditUser } from '@defra/forms-model'
 * @import { ExcelGenerationData } from '~/src/messaging/mappers/events.js'
 */
