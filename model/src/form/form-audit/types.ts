import {
  type AuditEventMessageCategory,
  type AuditEventMessageSchemaVersion,
  type AuditEventMessageType
} from '~/src/form/form-audit/enums.js'

export interface FormMessageData {
  formId: string
  slug: string
}

export interface ChangesMessageData<T> {
  previous: T
  new: T
}

export interface FormCreatedMessageData extends FormMessageData {
  title: string
  organisation: string
  teamName: string
  teamEmail: string
}

export interface SupportEmailChanges {
  supportEmail: string
  responseTime: string
}

export interface SupportEmailUpdatedMessageData extends FormMessageData {
  changes: ChangesMessageData<SupportEmailChanges>
}

export interface AuditUser {
  id: string
  displayName: string
}

export type MessageData =
  | FormCreatedMessageData
  | SupportEmailUpdatedMessageData

export interface BaseMessage {
  schemaVersion: AuditEventMessageSchemaVersion
  category: AuditEventMessageCategory
  type: AuditEventMessageType
  createdAt: Date
  createdBy: AuditUser
  data: MessageData
}

export interface FormCreatedMessage extends BaseMessage {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_CREATED
  data: FormCreatedMessageData
}

export interface SupportEmailUpdatedMessage extends BaseMessage {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
  data: SupportEmailUpdatedMessageData
}

export type Message = FormCreatedMessage | SupportEmailUpdatedMessage

export interface AuditEvent {
  message: Message
}

export type AuditRecord = Message & {
  messageId: string
}

export interface MessageBody {
  Message: string
}
