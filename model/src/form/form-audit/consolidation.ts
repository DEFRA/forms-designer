import { AuditEventMessageType } from '~/src/form/form-audit/enums.js'
import {
  type AuditRecord,
  type ConsolidatedAuditRecord
} from '~/src/form/form-audit/types.js'

/**
 * Field configuration for audit events with change tracking.
 * Used by change detection logic to compare previous and new values.
 */
export interface FieldConfig {
  label: string
  verb: 'Updated' | 'Changed'
  prevPath: string
  newPath: string
}

/**
 * Support contact field configuration for change detection.
 */
export interface SupportContactFieldConfig {
  label: string
  prevPath: string
  newPath: string
}

/**
 * Field configurations for audit events with change tracking.
 * Maps event types to their data paths and display labels.
 */
export const fieldConfigs: Record<string, FieldConfig> = {
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
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: {
    label: 'the privacy notice link',
    verb: 'Updated',
    prevPath: 'changes.previous.privacyNoticeUrl',
    newPath: 'changes.new.privacyNoticeUrl'
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
 * Support contact field configurations for change detection.
 * Used when checking FORM_SUPPORT_CONTACT_UPDATED events.
 */
export const supportContactFields: SupportContactFieldConfig[] = [
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
    label: 'online contact link',
    prevPath: 'changes.previous.contact.online.url',
    newPath: 'changes.new.contact.online.url'
  }
]

/**
 * Event types that are always considered valid (don't need change comparison).
 * These events represent actions rather than field updates.
 */
export const alwaysValidEvents = new Set<string>([
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
 * Type guard to check if an audit record is consolidated.
 * @param record - The audit record to check
 * @returns True if the record has consolidation metadata
 */
export function isConsolidatedRecord(
  record: AuditRecord | ConsolidatedAuditRecord
): record is ConsolidatedAuditRecord {
  return 'consolidatedCount' in record && record.consolidatedCount > 1
}
