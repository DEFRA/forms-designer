import { AuditEventMessageType } from '@defra/forms-model'

/**
 * Field configurations for audit events with change tracking.
 * Used by both change detection and event description generation.
 * @type {Record<string, { label: string, verb: 'Updated' | 'Changed', prevPath: string, newPath: string }>}
 */
export const fieldConfigs = {
  [AuditEventMessageType.FORM_TITLE_UPDATED]: {
    label: 'the form name',
    verb: 'Updated',
    prevPath: 'changes.previous.title',
    newPath: 'changes.new.title'
  },
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]: {
    label: 'the lead organisation',
    verb: 'Changed',
    prevPath: 'changes.previous.organisation',
    newPath: 'changes.new.organisation'
  },
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: {
    label: 'the team name',
    verb: 'Changed',
    prevPath: 'changes.previous.teamName',
    newPath: 'changes.new.teamName'
  },
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: {
    label: 'the shared team address',
    verb: 'Updated',
    prevPath: 'changes.previous.teamEmail',
    newPath: 'changes.new.teamEmail'
  },
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]: {
    label: 'where submitted forms are sent',
    verb: 'Updated',
    prevPath: 'changes.previous.notificationEmail',
    newPath: 'changes.new.notificationEmail'
  },
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]: {
    label: 'the next steps guidance',
    verb: 'Updated',
    prevPath: 'changes.previous.submissionGuidance',
    newPath: 'changes.new.submissionGuidance'
  },
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: {
    label: 'the support phone number',
    verb: 'Updated',
    prevPath: 'changes.previous.phone',
    newPath: 'changes.new.phone'
  },
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: {
    label: 'the support email address',
    verb: 'Updated',
    prevPath: 'changes.previous.address',
    newPath: 'changes.new.address'
  },
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: {
    label: 'the support contact link',
    verb: 'Updated',
    prevPath: 'changes.previous.url',
    newPath: 'changes.new.url'
  }
}

/**
 * Support contact field configurations for change detection
 * @type {Array<{ label: string, prevPath: string, newPath: string }>}
 */
export const supportContactFields = [
  {
    label: 'phone number',
    prevPath: 'changes.previous.contact.phone',
    newPath: 'changes.new.contact.phone'
  },
  {
    label: 'email address',
    prevPath: 'changes.previous.contact.email.address',
    newPath: 'changes.new.contact.email.address'
  },
  {
    label: 'email response time',
    prevPath: 'changes.previous.contact.email.responseTime',
    newPath: 'changes.new.contact.email.responseTime'
  },
  {
    label: 'online contact link',
    prevPath: 'changes.previous.contact.online.url',
    newPath: 'changes.new.contact.online.url'
  },
  {
    label: 'online contact text',
    prevPath: 'changes.previous.contact.online.text',
    newPath: 'changes.new.contact.online.text'
  }
]

/**
 * Privacy notice field configurations for change detection
 * @type {Array<{ label: string, prevPath: string, newPath: string }>}
 */
export const privacyNoticeFields = [
  {
    label: 'privacy notice type',
    prevPath: 'changes.previous.privacyNoticeType',
    newPath: 'changes.new.privacyNoticeType'
  },
  {
    label: 'privacy notice text',
    prevPath: 'changes.previous.privacyNoticeText',
    newPath: 'changes.new.privacyNoticeText'
  },
  {
    label: 'privacy notice url',
    prevPath: 'changes.previous.privacyNoticeUrl',
    newPath: 'changes.new.privacyNoticeUrl'
  }
]

/**
 * Event types that are always considered valid (don't need change comparison)
 * @type {Set<string>}
 */
export const alwaysValidEvents = new Set([
  AuditEventMessageType.FORM_CREATED,
  AuditEventMessageType.FORM_UPDATED,
  AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
  AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
  AuditEventMessageType.FORM_DRAFT_DELETED,
  AuditEventMessageType.FORM_MIGRATED,
  AuditEventMessageType.FORM_JSON_UPLOADED,
  AuditEventMessageType.FORM_JSON_DOWNLOADED,
  AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
  AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED,
  AuditEventMessageType.FORM_TERMS_AND_CONDITIONS_AGREED
])
