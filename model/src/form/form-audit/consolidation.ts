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
 * Creates a field configuration for audit events.
 */
function createFieldConfig(
  label: string,
  verb: 'Updated' | 'Changed',
  fieldName: string
): FieldConfig {
  return {
    label,
    verb,
    prevPath: `changes.previous.${fieldName}`,
    newPath: `changes.new.${fieldName}`
  }
}

/**
 * Creates a support contact field configuration.
 */
function createSupportContactField(
  label: string,
  contactPath: string
): SupportContactFieldConfig {
  return {
    label,
    prevPath: `changes.previous.contact.${contactPath}`,
    newPath: `changes.new.contact.${contactPath}`
  }
}

/**
 * Field configurations for audit events with change tracking.
 * Maps event types to their data paths and display labels.
 */
export const fieldConfigs: Record<string, FieldConfig> = {
  [AuditEventMessageType.FORM_TITLE_UPDATED]: createFieldConfig(
    'the form name',
    'Updated',
    'title'
  ),
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]: createFieldConfig(
    'the lead organisation',
    'Changed',
    'organisation'
  ),
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: createFieldConfig(
    'the team name',
    'Changed',
    'teamName'
  ),
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: createFieldConfig(
    'the shared team address',
    'Updated',
    'teamEmail'
  ),
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]: createFieldConfig(
    'where submitted forms are sent',
    'Updated',
    'notificationEmail'
  ),
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: createFieldConfig(
    'the privacy notice link',
    'Updated',
    'privacyNoticeUrl'
  ),
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]: createFieldConfig(
    'the next steps guidance',
    'Updated',
    'submissionGuidance'
  ),
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: createFieldConfig(
    'the support phone number',
    'Updated',
    'phone'
  ),
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: createFieldConfig(
    'the support email address',
    'Updated',
    'address'
  ),
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: createFieldConfig(
    'the support contact link',
    'Updated',
    'url'
  )
}

/**
 * Support contact field configurations for change detection.
 * Used when checking FORM_SUPPORT_CONTACT_UPDATED events.
 */
export const supportContactFields: SupportContactFieldConfig[] = [
  createSupportContactField('phone number', 'phone'),
  createSupportContactField('email address', 'email.address'),
  createSupportContactField('online contact link', 'online.url')
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
