import Joi, { type ObjectSchema } from 'joi'

import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType,
  FormDefinitionRequestType
} from '~/src/form/form-audit/enums.js'
import {
  type AuditEvent,
  type AuditMessage,
  type AuditRecord,
  type AuditUser,
  type ChangesMessageData,
  type EntitlementMessageData,
  type FormCreatedMessageData,
  type FormDefinitionS3Meta,
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
  slug: Joi.string().required(),
  payload: Joi.object().optional()
})

export const formCreatedMessageData =
  formMessageDataBase.append<FormCreatedMessageData>({
    title: Joi.string().required(),
    organisation: Joi.string().required(),
    teamName: Joi.string().required(),
    teamEmail: Joi.string().required()
  })

export const formDefinitionS3Meta = Joi.object<FormDefinitionS3Meta>().keys({
  fileId: Joi.string().required(),
  filename: Joi.string().required(),
  s3Key: Joi.string().required()
})

export const formUpdatedMessageData =
  formMessageDataBase.append<FormUpdatedMessageData>({
    requestType: Joi.string()
      .valid(...Object.values(FormDefinitionRequestType))
      .required(),
    s3Meta: formDefinitionS3Meta
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

export const formSupportEmailChanges =
  Joi.object<FormSupportEmailChanges>().keys({
    address: Joi.string().email().required(),
    responseTime: Joi.string().required()
  })

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

export const entitlementMessageData = Joi.object<EntitlementMessageData>().keys(
  {
    userId: Joi.string().required(),
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string())
  }
)

export const auditUserSchema = Joi.object<AuditUser>().keys({
  id: Joi.string().uuid().required(),
  displayName: Joi.string().required()
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

export const messageSchema = Joi.object<AuditMessage>().keys({
  schemaVersion: Joi.string()
    .valid(...Object.values(AuditEventMessageSchemaVersion))
    .required(),
  category: Joi.string()
    .valid(...Object.values(AuditEventMessageCategory))
    .required(),
  source: Joi.string()
    .valid(...Object.values(AuditEventMessageSource))
    .required(),
  type: Joi.string().valid(...Object.values(AuditEventMessageType)),
  entityId: Joi.string().required(),
  traceId: Joi.string().optional(),
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
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.ENTITLEMENT_CREATED),
        then: entitlementMessageData
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.ENTITLEMENT_UPDATED),
        then: entitlementMessageData
      },
      {
        is: Joi.string()
          .trim()
          .valid(AuditEventMessageType.ENTITLEMENT_DELETED),
        then: entitlementMessageData
      }
    ],
    otherwise: Joi.forbidden()
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
