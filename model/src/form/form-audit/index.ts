import Joi, { type ObjectSchema } from 'joi'

import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageType,
  FormDefinitionRequestType
} from '~/src/form/form-audit/enums.js'
import {
  type AuditEvent,
  type AuditMessage,
  type AuditRecord,
  type AuditUser,
  type ChangesMessageData,
  type FormCreatedMessageData,
  type FormDefinitionMessageBase,
  type FormMessageChangesData,
  type FormMessageDataBase,
  type FormNotificationEmailChanges,
  type FormNotificationEmailUpdatedMessageData,
  type FormOrganisationChanges,
  type FormOrganisationUpdatedMessageData,
  type FormPrivacyNoticeChanges,
  type FormPrivacyNoticeUpdatedMessageData,
  type FormSubmissionGuidanceChanges,
  type FormSubmissionGuidanceUpdatedMessageData,
  type FormSupportContactChanges,
  type FormSupportContactUpdatedMessageData,
  type FormSupportEmailChanges,
  type FormSupportEmailUpdatedMessageData,
  type FormSupportOnlineChanges,
  type FormSupportOnlineUpdatedMessageData,
  type FormSupportPhoneChanges,
  type FormSupportPhoneUpdatedMessageData,
  type FormTeamEmailChanges,
  type FormTeamEmailUpdatedMessageData,
  type FormTeamNameChanges,
  type FormTeamNameUpdatedMessageData,
  type FormTitleChanges,
  type FormTitleUpdatedMessageData,
  type FormUpdatedMessageData,
  type FormUploadedChanges,
  type FormUploadedMessageData
} from '~/src/form/form-audit/types.js'
import { contactSchema } from '~/src/form/form-metadata/index.js'

export const formMessageDataBase = Joi.object<FormMessageDataBase>({
  formId: Joi.string().required(),
  slug: Joi.string().required()
})

export const formCreatedMessageData =
  formMessageDataBase.append<FormCreatedMessageData>({
    title: Joi.string().required(),
    organisation: Joi.string().required(),
    teamName: Joi.string().required(),
    teamEmail: Joi.string().required()
  })

export const formDefinitionMessageBase =
  formMessageDataBase.append<FormDefinitionMessageBase>({
    fileId: Joi.string().optional(),
    filename: Joi.string().optional(),
    s3Key: Joi.string().optional()
  })

const allowedDefinitionRequestTypes = [
  FormDefinitionRequestType.CREATE_COMPONENT,
  FormDefinitionRequestType.UPDATE_COMPONENT,
  FormDefinitionRequestType.DELETE_COMPONENT,
  FormDefinitionRequestType.ADD_CONDITION,
  FormDefinitionRequestType.UPDATE_CONDITION,
  FormDefinitionRequestType.REMOVE_CONDITION,
  FormDefinitionRequestType.REORDER_PAGES,
  FormDefinitionRequestType.REORDER_COMPONENTS,
  FormDefinitionRequestType.ADD_LIST,
  FormDefinitionRequestType.UPDATE_LIST,
  FormDefinitionRequestType.REMOVE_LIST,
  FormDefinitionRequestType.CREATE_PAGE,
  FormDefinitionRequestType.UPDATE_PAGE_FIELDS,
  FormDefinitionRequestType.DELETE_PAGE
]

export const formUpdatedMessageData =
  formMessageDataBase.append<FormUpdatedMessageData>({
    payload: Joi.object().required(),
    requestType: Joi.string().valid(...allowedDefinitionRequestTypes)
  })

export const formTitleChanges = Joi.object<FormTitleChanges>()
  .keys({
    title: Joi.string().required()
  })
  .required()

export const formOrganisationChanges = Joi.object<FormOrganisationChanges>()
  .keys({
    organisation: Joi.string().required()
  })
  .required()

export const formTeamNameChanges = Joi.object<FormTeamNameChanges>()
  .keys({
    teamName: Joi.string().required()
  })
  .required()

export const formTeamEmailChanges = Joi.object<FormTeamEmailChanges>()
  .keys({
    teamEmail: Joi.string().required()
  })
  .required()

export const formSupportContactChanges = Joi.object<FormSupportContactChanges>()
  .keys({
    contact: contactSchema
  })
  .required()

export const formSupportPhoneChanges = Joi.object<FormSupportPhoneChanges>()
  .keys({
    phone: Joi.string().required()
  })
  .required()

export const formSupportOnlineChanges = Joi.object<FormSupportOnlineChanges>()
  .keys({
    url: Joi.string().required(),
    text: Joi.string().required()
  })
  .required()

export const formPrivacyNoticeChanges = Joi.object<FormPrivacyNoticeChanges>()
  .keys({
    privacyNoticeUrl: Joi.string()
  })
  .required()

export const formNotificationEmailChanges =
  Joi.object<FormNotificationEmailChanges>()
    .keys({
      notificationEmail: Joi.string()
    })
    .required()

export const formSubmissionGuidanceChanges =
  Joi.object<FormSubmissionGuidanceChanges>()
    .keys({
      submissionGuidance: Joi.string()
    })
    .required()

export const formUploadedChanges = Joi.object<FormUploadedChanges>()
  .keys({
    value: Joi.string().required()
  })
  .required()

export const formSupportEmailChanges =
  Joi.object<FormSupportEmailChanges>().keys({
    address: Joi.string().email().required(),
    responseTime: Joi.string().required()
  })

export function formChangesMessageData<T, U extends FormMessageChangesData>(
  schema: ObjectSchema<T>
): ObjectSchema<U> {
  return formMessageDataBase.append<U>({
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
  AuditEventMessageType.FORM_PUBLISHED,
  AuditEventMessageType.FORM_TITLE_UPDATED,
  AuditEventMessageType.FORM_ORGANISATION_UPDATED,
  AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
  AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
  AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
  AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED,
  AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED,
  AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED,
  AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED,
  AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED,
  AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED,
  AuditEventMessageType.FORM_UPDATED,
  AuditEventMessageType.FORM_JSON_UPLOADED,
  AuditEventMessageType.FORM_JSON_DOWNLOADED,
  AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
  AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
  AuditEventMessageType.FORM_DRAFT_DELETED,
  AuditEventMessageType.FORM_MIGRATED
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
        is: Joi.string().trim().valid(AuditEventMessageType.FORM_TITLE_UPDATED),
        then: formChangesMessageData<
          FormTitleChanges,
          FormTitleUpdatedMessageData
        >(formTitleChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_ORGANISATION_UPDATED),
        then: formChangesMessageData<
          FormOrganisationChanges,
          FormOrganisationUpdatedMessageData
        >(formOrganisationChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_TEAM_NAME_UPDATED),
        then: formChangesMessageData<
          FormTeamNameChanges,
          FormTeamNameUpdatedMessageData
        >(formTeamNameChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED),
        then: formChangesMessageData<
          FormTeamEmailChanges,
          FormTeamEmailUpdatedMessageData
        >(formTeamEmailChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED),
        then: formChangesMessageData<
          FormSupportContactChanges,
          FormSupportContactUpdatedMessageData
        >(formSupportContactChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED),
        then: formChangesMessageData<
          FormSupportPhoneChanges,
          FormSupportPhoneUpdatedMessageData
        >(formSupportPhoneChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED),
        then: formChangesMessageData<
          FormSupportEmailChanges,
          FormSupportEmailUpdatedMessageData
        >(formSupportEmailChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED),
        then: formChangesMessageData<
          FormSupportOnlineChanges,
          FormSupportOnlineUpdatedMessageData
        >(formSupportOnlineChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED),
        then: formChangesMessageData<
          FormPrivacyNoticeChanges,
          FormPrivacyNoticeUpdatedMessageData
        >(formPrivacyNoticeChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED),
        then: formChangesMessageData<
          FormNotificationEmailChanges,
          FormNotificationEmailUpdatedMessageData
        >(formNotificationEmailChanges)
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED),
        then: formChangesMessageData<
          FormSubmissionGuidanceChanges,
          FormSubmissionGuidanceUpdatedMessageData
        >(formSubmissionGuidanceChanges)
      },
      {
        is: Joi.string().trim().valid(AuditEventMessageType.FORM_JSON_UPLOADED),
        then: formChangesMessageData<
          FormUploadedChanges,
          FormUploadedMessageData
        >(formUploadedChanges)
      },
      {
        is: Joi.string().trim().valid(AuditEventMessageType.FORM_UPDATED),
        then: formUpdatedMessageData
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
