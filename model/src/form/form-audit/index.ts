import Joi from 'joi'

export const formMessageDataSchema = Joi.object({
  formId: Joi.string().trim().required(),
  slug: Joi.string().trim().required()
})

export interface ChangesMessageData<T> {
  previous: T
  new: T
}

// export const changesMessageData<T> = Joi.object<ChangesMessageData<T>>().keys({
//   previous: Joi.string().trim().required(),
//   new:
// })

export const formCreatedMessageData = formMessageDataSchema.append({
  title: Joi.string().trim().required(),
  organisation: Joi.string().trim().required(),
  teamName: Joi.string().trim().required(),
  teamEmail: Joi.string().trim().required()
})

export const supportEmailUpdatedMessageData = formMessageDataSchema.append({
  changes: Joi.string().trim().required()
})

// export type MessageData =
//   | FormCreatedMessageData
//   | SupportEmailUpdatedMessageData

// export interface BaseMessage {
//   schemaVersion: AuditEventMessageSchemaVersion
//   category: AuditEventMessageCategory
//   type: AuditEventMessageType
//   createdAt: Date
//   createdBy: {
//     id: string
//     displayName: string
//   }
//   data: MessageData
// }

// export interface FormCreatedMessage extends BaseMessage {
//   category: AuditEventMessageCategory.FORM
//   type: AuditEventMessageType.FORM_CREATED
//   data: FormCreatedMessageData
// }

// export interface SupportEmailUpdatedMessage extends BaseMessage {
//   category: AuditEventMessageCategory.FORM
//   type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
//   data: SupportEmailUpdatedMessageData
// }

// export type Message = FormCreatedMessage | SupportEmailUpdatedMessage

// export interface AuditEvent {
//   message: Message
// }
