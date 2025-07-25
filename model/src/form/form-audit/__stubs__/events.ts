import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageType
} from '~/src/form/form-audit/enums.js'
import {
  type AuditUser,
  type FormCreatedMessage,
  type FormCreatedMessageData
} from '~/src/form/form-audit/types.js'

export const formCreatedFormId = '8c772d00-beac-4a29-95cb-033a263d0f1b'

export function buildFormCreatedMessageData(
  partialFormCreatedMessageData: Partial<FormCreatedMessageData> = {}
): FormCreatedMessageData {
  return {
    formId: formCreatedFormId,
    slug: 'chemistry',
    title: 'Chemistry',
    organisation: 'Defra',
    teamName: 'Forms Team',
    teamEmail: 'forms@example.com',
    ...partialFormCreatedMessageData
  }
}

export function buildAuditUser(auditUser: Partial<AuditUser> = {}): AuditUser {
  return {
    displayName: 'Enrique Chase',
    id: '18ab1e08-c921-4bb6-a19c-e677c709cc6d',
    ...auditUser
  }
}

export function buildFormCreatedMessage(
  partialFormCreatedMessage: Partial<FormCreatedMessage> = {}
): FormCreatedMessage {
  return {
    type: AuditEventMessageType.FORM_CREATED,
    category: AuditEventMessageCategory.FORM,
    createdAt: new Date('2025-07-23'),
    createdBy: buildAuditUser(),
    data: buildFormCreatedMessageData(),
    schemaVersion: AuditEventMessageSchemaVersion.V1,
    ...partialFormCreatedMessage
  } as FormCreatedMessage
}
