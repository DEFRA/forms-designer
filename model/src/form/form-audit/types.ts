import {
  type AuditEventMessageCategory,
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
  createdAt: Date
  createdBy: {
    id: string
    displayName: string
  }
  updatedAt: Date
  updatedBy: {
    id: string
    displayName: string
  }
}

export interface SupportEmailUpdatedMessageData extends FormMessageData {
  changes: ChangesMessageData<{ supportEmail: string; responseTime: string }>
}

export type MessageData =
  | FormCreatedMessageData
  | SupportEmailUpdatedMessageData

export interface BaseMessage {
  schemaVersion: string
  category: AuditEventMessageCategory
  type: AuditEventMessageType
  createdAt: Date
  createdBy: {
    id: string
    displayName: string
  }
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
