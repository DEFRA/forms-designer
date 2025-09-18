import { messageSchema } from '@defra/forms-model'
import Joi from 'joi'

import {
  authenticationLoginMapper,
  authenticationLogoutAutoMapper,
  authenticationLogoutDifferentDevicelMapper,
  authenticationLogoutManualMapper,
  formDownloadedMapper,
  formFileDownloadedMapper
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
 * @import { AuditMessage, AuditUser } from '@defra/forms-model'
 */
