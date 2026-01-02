import { AuditEventMessageType } from '@defra/forms-model'

import {
  safeGet,
  supportContactFields
} from '~/src/models/forms/history-event-descriptions.js'

/**
 * Event types that are always considered valid (don't need change comparison)
 * @type {Set<string>}
 */
const alwaysValidEvents = new Set([
  AuditEventMessageType.FORM_CREATED,
  AuditEventMessageType.FORM_UPDATED,
  AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
  AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
  AuditEventMessageType.FORM_DRAFT_DELETED,
  AuditEventMessageType.FORM_MIGRATED,
  AuditEventMessageType.FORM_JSON_UPLOADED,
  AuditEventMessageType.FORM_JSON_DOWNLOADED,
  AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
  AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
])

/**
 * Field path configurations for single-field change detection
 * @type {Record<string, { prevPath: string, newPath: string }>}
 */
const changeFieldPaths = {
  [AuditEventMessageType.FORM_TITLE_UPDATED]: {
    prevPath: 'changes.previous.title',
    newPath: 'changes.new.title'
  },
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]: {
    prevPath: 'changes.previous.organisation',
    newPath: 'changes.new.organisation'
  },
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: {
    prevPath: 'changes.previous.teamName',
    newPath: 'changes.new.teamName'
  },
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.teamEmail',
    newPath: 'changes.new.teamEmail'
  },
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.notificationEmail',
    newPath: 'changes.new.notificationEmail'
  },
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: {
    prevPath: 'changes.previous.privacyNoticeUrl',
    newPath: 'changes.new.privacyNoticeUrl'
  },
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]: {
    prevPath: 'changes.previous.submissionGuidance',
    newPath: 'changes.new.submissionGuidance'
  },
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: {
    prevPath: 'changes.previous.phone',
    newPath: 'changes.new.phone'
  },
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.address',
    newPath: 'changes.new.address'
  },
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: {
    prevPath: 'changes.previous.url',
    newPath: 'changes.new.url'
  }
}

/**
 * Checks if any support contact field has changed
 * @param {MessageData} data
 * @returns {boolean}
 */
function hasSupportContactChange(data) {
  return supportContactFields.some((field) => {
    const prevValue = safeGet(data, field.prevPath)
    const newValue = safeGet(data, field.newPath)
    return Boolean(newValue && newValue !== prevValue)
  })
}

/**
 * Checks if an audit record represents an actual change
 * Returns false if the record has changes where previous and new values are identical
 * @param {AuditRecord} record
 * @returns {boolean}
 */
export function hasActualChange(record) {
  const { type, data } = record

  if (alwaysValidEvents.has(type)) {
    return true
  }

  if (!data) {
    return true
  }

  if (type in changeFieldPaths) {
    const fieldPaths = changeFieldPaths[type]
    return (
      safeGet(data, fieldPaths.prevPath) !== safeGet(data, fieldPaths.newPath)
    )
  }

  if (
    String(type) === String(AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED)
  ) {
    return hasSupportContactChange(data)
  }

  return true
}

/**
 * Filters out audit records that don't represent actual changes
 * @param {AuditRecord[]} records
 * @returns {AuditRecord[]}
 */
export function filterNoChangeEvents(records) {
  return records.filter(hasActualChange)
}

/**
 * @import { AuditRecord, MessageData } from '@defra/forms-model'
 */
