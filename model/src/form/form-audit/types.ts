import {
  type AuditEventMessageCategory,
  type AuditEventMessageSchemaVersion,
  type AuditEventMessageType
} from '~/src/form/form-audit/enums.js'

export interface FormMessageDataBase {
  formId: string
  slug: string
}

export interface ChangesMessageData<T> {
  previous: T
  new: T
}

export interface FormCreatedMessageData extends FormMessageDataBase {
  title: string
  organisation: string
  teamName: string
  teamEmail: string
}

export interface SupportEmailChanges {
  supportEmail: string
  responseTime: string
}

export interface SupportEmailUpdatedMessageData extends FormMessageDataBase {
  changes: ChangesMessageData<SupportEmailChanges>
}

export interface AuditUser {
  id: string
  displayName: string
}

export type MessageData =
  | FormCreatedMessageData
  | SupportEmailUpdatedMessageData

export interface MessageBase {
  entityId: string
  schemaVersion: AuditEventMessageSchemaVersion
  category: AuditEventMessageCategory
  type: AuditEventMessageType
  createdAt: Date
  createdBy: AuditUser
  data: MessageData
  messageCreatedAt: Date
}

export interface FormCreatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_CREATED
  data: FormCreatedMessageData
}

export interface FormSupportEmailUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
  data: SupportEmailUpdatedMessageData
}

export type AuditMessage = FormCreatedMessage | FormSupportEmailUpdatedMessage

export interface AuditEvent {
  message: AuditMessage
}

export type AuditRecord = AuditMessage & {
  messageId: string
  recordCreatedAt: Date
}

export interface MessageBody {
  Message: string
}
