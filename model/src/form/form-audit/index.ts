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
  type AuthenticationMessageData,
  type ChangesMessageData,
  type EntitlementMessageData,
  type ExcelGenerationMessageData,
  type FormCreatedMessageData,
  type FormDefinitionS3Meta,
  type FormFileDownloadedMessageData,
  type FormMessageChangesData,
  type FormMessageDataBase,
  type FormNotificationEmailChanges,
  type FormNotificationEmailUpdatedMessageData,
  type FormOrganisationChanges,
  type FormOrganisationUpdatedMessageData,
  type FormPrivacyNoticeChanges,
  type FormPrivacyNoticeUpdatedMessageData,
  type FormSecretSavedMessageData,
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
  type FormTermsAndConditionsAgreedMessageData,
  type FormTermsAndConditionsChanges,
  type FormTitleChanges,
  type FormTitleUpdatedMessageData,
  type FormUpdatedMessageData,
  type FormUploadedChanges,
  type FormUploadedMessageData,
  type FormsBackupRequestedMessageData
} from '~/src/form/form-audit/types.js'
import {
  contactSchema,
  emailAddressSchema,
  emailResponseTimeSchema,
  idSchema,
  notificationEmailAddressSchema,
  onlineTextSchema,
  onlineUrlSchema,
  organisationSchema,
  phoneSchema,
  privacyNoticeTextSchema,
  privacyNoticeTypeSchema,
  privacyNoticeUrlSchema,
  slugSchema,
  submissionGuidanceSchema,
  teamEmailSchema,
  teamNameSchema,
  termsAndConditionsAgreedSchema,
  titleSchema
} from '~/src/form/form-metadata/index.js'

export const formMessageDataBase = Joi.object<FormMessageDataBase>({
  formId: idSchema,
  slug: slugSchema,
  payload: Joi.object().optional()
})
  .required()
  .description('The base data object for Form Messages')

export const formCreatedMessageData = formMessageDataBase
  .append<FormCreatedMessageData>({
    title: titleSchema,
    organisation: organisationSchema,
    teamName: teamNameSchema,
    teamEmail: teamEmailSchema
  })
  .required()
  .description('Message data schema for when a form is created')

export const formDefinitionS3Meta = Joi.object<FormDefinitionS3Meta>()
  .keys({
    fileId: Joi.string().required(),
    filename: Joi.string().required(),
    s3Key: Joi.string().required()
  })
  .description('Schema for form data S3 object in message')

export const formUpdatedMessageData = formMessageDataBase
  .append<FormUpdatedMessageData>({
    requestType: Joi.string()
      .valid(...Object.values(FormDefinitionRequestType))
      .required(),
    s3Meta: formDefinitionS3Meta.optional()
  })
  .required()

export const formsBackupRequestedMessageData =
  Joi.object<FormsBackupRequestedMessageData>().keys({
    totalForms: Joi.number().integer().min(0).required(),
    durationMs: Joi.number().min(0).required()
  })
export const formsSecretSavedMessageData =
  Joi.object<FormSecretSavedMessageData>().keys({
    formId: Joi.string().required(),
    slug: Joi.string().required(),
    secretName: Joi.string().required()
  })
export const formTitleChanges = Joi.object<FormTitleChanges>()
  .keys({
    title: titleSchema
  })
  .required()
  .description('Changes schema for FORM_TITLE_UPDATED event')

export const formOrganisationChanges = Joi.object<FormOrganisationChanges>()
  .keys({
    organisation: organisationSchema
  })
  .required()
  .description('Changes schema for FORM_ORGANISATION_UPDATED event')

export const formTeamNameChanges = Joi.object<FormTeamNameChanges>()
  .keys({
    teamName: teamNameSchema
  })
  .required()
  .description('Changes schema for FORM_TEAM_NAME_UPDATED event')

export const formTeamEmailChanges = Joi.object<FormTeamEmailChanges>()
  .keys({
    teamEmail: teamEmailSchema
  })
  .required()
  .description('Changes schema for FORM_TEAM_EMAIL_UPDATED event')

export const formSupportContactChanges = Joi.object<FormSupportContactChanges>()
  .keys({
    contact: contactSchema
  })
  .required()
  .description('Changes schema for FORM_SUPPORT_CONTACT_UPDATED event')

export const formSupportPhoneChanges = Joi.object<FormSupportPhoneChanges>()
  .keys({
    phone: phoneSchema
  })
  .required()
  .description('Changes schema for FORM_SUPPORT_PHONE_UPDATED event')

export const formSupportOnlineChanges = Joi.object<FormSupportOnlineChanges>()
  .keys({
    url: onlineUrlSchema.optional(),
    text: onlineTextSchema.optional()
  })
  .required()
  .description('Changes schema for FORM_SUPPORT_ONLINE_UPDATED event')

export const formSupportEmailChanges = Joi.object<FormSupportEmailChanges>()
  .keys({
    address: emailAddressSchema.optional(),
    responseTime: emailResponseTimeSchema.optional()
  })
  .description('Changes schema for FORM_SUPPORT_EMAIL_UPDATED event')

export const formPrivacyNoticeChanges = Joi.object<FormPrivacyNoticeChanges>()
  .keys({
    privacyNoticeType: privacyNoticeTypeSchema,
    privacyNoticeText: Joi.when('privacyNoticeType', {
      is: 'text',
      then: privacyNoticeTextSchema,
      otherwise: privacyNoticeTextSchema.allow('')
    }),
    privacyNoticeUrl: Joi.when('privacyNoticeType', {
      is: 'link',
      then: privacyNoticeUrlSchema,
      otherwise: privacyNoticeUrlSchema.allow('')
    })
  })
  .required()
  .description('Changes schema for FORM_PRIVACY_NOTICE_UPDATED event')

export const formTermsAndConditionsChanges =
  Joi.object<FormTermsAndConditionsChanges>()
    .keys({
      termsAndConditionsAgreed: termsAndConditionsAgreedSchema
    })
    .required()
    .description('Changes schema for FORM_TERMS_AND_CONDITIONS_AGREED event')

export const formNotificationEmailChanges =
  Joi.object<FormNotificationEmailChanges>()
    .keys({
      notificationEmail: notificationEmailAddressSchema
    })
    .required()
    .description('Changes schema for FORM_NOTIFICATION_EMAIL_UPDATED event')

export const formSubmissionGuidanceChanges =
  Joi.object<FormSubmissionGuidanceChanges>()
    .keys({
      submissionGuidance: submissionGuidanceSchema
    })
    .required()
    .description('Changes schema for FORM_SUBMISSION_GUIDANCE_UPDATED event')

export const formUploadedChanges = Joi.object<FormUploadedChanges>()
  .keys({
    value: Joi.string().required()
  })
  .required()
  .description('Changes schema for FORM_JSON_UPLOADED event')

export const entitlementMessageData = Joi.object<EntitlementMessageData>().keys(
  {
    userId: Joi.string().required(),
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string())
  }
)

export const formFileDownloadedMessageData =
  Joi.object<FormFileDownloadedMessageData>()
    .keys({
      fileId: Joi.string().required(),
      filename: Joi.string().required(),
      fileLink: Joi.string().required()
    })
    .required()
    .description(
      'Schema for FORM_FILE_DOWNLOAD_SUCCESS and FORM_FILE_DOWNLOAD_FAILURE events'
    )

export const excelGenerationMessageData =
  Joi.object<ExcelGenerationMessageData>()
    .keys({
      formId: Joi.string().required(),
      formName: Joi.string().required(),
      notificationEmail: Joi.string().email().required()
    })
    .required()
    .description(
      'Schema for Excel generation audit events (submissions and CSAT)'
    )

export const authenticationMessageData =
  Joi.object<AuthenticationMessageData>().keys({
    userId: Joi.string().required(),
    displayName: Joi.string().required()
  })

export const auditUserSchema = Joi.object<AuditUser>()
  .keys({
    id: Joi.string().required(),
    displayName: Joi.string().required()
  })
  .description('Schema for CREATED_BY audit event')

export function formChangesMessageData<T, U extends FormMessageChangesData>(
  schema: ObjectSchema<T>
): ObjectSchema<U> {
  return formMessageDataBase.append<U>({
    changes: Joi.object<ChangesMessageData<T>>()
      .keys({
        previous: schema,
        new: schema
      })
      .description('Changes schema')
  })
}

export const messageSchema = Joi.object<AuditMessage>()
  .keys({
    schemaVersion: Joi.string()
      .valid(...Object.values(AuditEventMessageSchemaVersion))
      .required()
      .description(
        'The version of the AuditMessage - bumped with breaking changes'
      ),
    category: Joi.string()
      .valid(...Object.values(AuditEventMessageCategory))
      .required()
      .description('The message category - what does the entityId represent?'),
    source: Joi.string()
      .valid(...Object.values(AuditEventMessageSource))
      .required()
      .description('Source of the message - which service?'),
    type: Joi.string()
      .valid(...Object.values(AuditEventMessageType))
      .description('Event type'),
    entityId: Joi.string()
      .required()
      .description('The id of the entity the category relates to'),
    traceId: Joi.string()
      .optional()
      .description(
        'Trace id of the event - to link events across multiple services'
      ),
    createdAt: Joi.date()
      .required()
      .description(
        'The ISO timestamp where the action took place - should be the same as updated_at field in DB'
      ),
    createdBy: auditUserSchema
      .required()
      .description('The user who performed the action being audited'),
    data: Joi.when('type', {
      switch: [
        {
          is: Joi.string().trim().valid(AuditEventMessageType.FORM_CREATED),
          then: formCreatedMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORM_TITLE_UPDATED),
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
            .valid(AuditEventMessageType.FORM_TERMS_AND_CONDITIONS_AGREED),
          then: formChangesMessageData<
            FormTermsAndConditionsChanges,
            FormTermsAndConditionsAgreedMessageData
          >(formTermsAndConditionsChanges)
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
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORM_JSON_UPLOADED),
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
            .valid(
              AuditEventMessageType.ENTITLEMENT_CREATED,
              AuditEventMessageType.ENTITLEMENT_UPDATED,
              AuditEventMessageType.ENTITLEMENT_DELETED
            ),
          then: entitlementMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORM_DRAFT_DELETED),
          then: formMessageDataBase
        },
        {
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORM_JSON_DOWNLOADED),
          then: formMessageDataBase
        },
        {
          is: Joi.string()
            .trim()
            .valid(
              AuditEventMessageType.AUTHENTICATION_LOGIN,
              AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL,
              AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO,
              AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE
            ),
          then: authenticationMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(
              AuditEventMessageType.FORM_FILE_DOWNLOAD_SUCCESS,
              AuditEventMessageType.FORM_FILE_DOWNLOAD_FAILURE
            ),
          then: formFileDownloadedMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(
              AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
              AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED,
              AuditEventMessageType.PLATFORM_CSAT_EXCEL_REQUESTED
            ),
          then: excelGenerationMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORMS_BACKUP_REQUESTED),
          then: formsBackupRequestedMessageData
        },
        {
          is: Joi.string()
            .trim()
            .valid(AuditEventMessageType.FORM_SECRET_SAVED),
          then: formsSecretSavedMessageData
        }
      ],
      otherwise: Joi.forbidden()
    }).description('The data/payload of the audit message'),
    messageCreatedAt: Joi.date()
      .required()
      .description('ISO timestamp when the message was published')
  })
  .required()
  .description('The audit message issued by the publishing service')

export const auditEvent = Joi.object<AuditEvent>()
  .keys({
    message: messageSchema
  })
  .description('The Body of the audit event')

export const auditRecord = messageSchema
  .append<AuditRecord>({
    id: idSchema,
    messageId: Joi.string().uuid().required(),
    entityId: Joi.string().required(),
    recordCreatedAt: Joi.date().required()
  })
  .description('The audit record persisted into the DB')
