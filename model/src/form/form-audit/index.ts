import Joi, { type ObjectSchema } from 'joi'

import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageType
} from '~/src/form/form-audit/enums.js'
import {
  type AuditEvent,
  type AuditMessage,
  type AuditRecord,
  type AuditUser,
  type ChangesMessageData,
  type FormCreatedMessageData,
  type FormMessageDataBase,
  type FormSupportEmailChanges,
  type FormSupportEmailUpdatedMessageData
} from '~/src/form/form-audit/types.js'

export const formMessageDataBase = Joi.object<FormMessageDataBase>({
  formId: Joi.string().trim().required(),
  slug: Joi.string().trim().required()
})

export const formCreatedMessageData =
  formMessageDataBase.append<FormCreatedMessageData>({
    title: Joi.string().trim().required(),
    organisation: Joi.string().trim().required(),
    teamName: Joi.string().trim().required(),
    teamEmail: Joi.string().trim().required()
  })

export const supportEmailChanges = Joi.object<FormSupportEmailChanges>().keys({
  address: Joi.string().email().required(),
  responseTime: Joi.string().required()
})

export function supportEmailUpdatedMessageData<T>(schema: ObjectSchema<T>) {
  return formMessageDataBase.append<FormSupportEmailUpdatedMessageData>({
    changes: Joi.object<ChangesMessageData<T>>().keys({
      previous: schema,
      new: schema
    })
  })
}

export const auditUserSchema = Joi.object<AuditUser>().keys({
  id: Joi.string().uuid().required(),
  displayName: Joi.string().required()
})

export const validCategories = [
  AuditEventMessageCategory.FORM,
  AuditEventMessageCategory.ENTITLEMENT
]

export const validTypes = [
  AuditEventMessageType.FORM_CREATED,
  AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
]

export const validMessageSchemaVersions = [AuditEventMessageSchemaVersion.V1]

export const messageSchema = Joi.object<AuditMessage>().keys({
  entityId: Joi.string().required(),
  schemaVersion: Joi.string()
    .valid(...validMessageSchemaVersions)
    .required(),
  type: Joi.string().valid(...validTypes),
  category: Joi.string()
    .valid(...validCategories)
    .required(),
  createdAt: Joi.date().required(),
  createdBy: auditUserSchema.required(),
  data: Joi.when('type', {
    switch: [
      {
        is: Joi.string().trim().valid(AuditEventMessageType.FORM_CREATED),
        then: formCreatedMessageData
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED),
        then: supportEmailUpdatedMessageData(supportEmailChanges)
      }
    ]
  }),
  messageCreatedAt: Joi.date().required()
})

export const auditEvent = Joi.object<AuditEvent>().keys({
  message: messageSchema
})

export const auditRecord = messageSchema.append<AuditRecord>({
  messageId: Joi.string().uuid().required(),
  entityId: Joi.string().required(),
  recordCreatedAt: Joi.date().required()
})
