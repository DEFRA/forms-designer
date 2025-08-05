import {
  type AuditEventMessageCategory,
  type AuditEventMessageObjectType,
  type AuditEventMessageSchemaVersion,
  type AuditEventMessageSource,
  type AuditEventMessageType,
  type FormDefinitionRequestType
} from '~/src/form/form-audit/enums.js'
import {
  type FormMetadata,
  type FormMetadataContact
} from '~/src/form/form-metadata/types.js'

export interface FormMessageDataBase {
  formId: string
  slug: string
  payload: unknown
}

export interface FormsManagerMessageDataBase extends FormMessageDataBase {
  objectType: AuditEventMessageObjectType
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

export interface FormTitleChanges {
  title: string
}

export interface FormOrganisationChanges {
  organisation: string
}

export interface FormTeamNameChanges {
  teamName: string
}

export interface FormTeamEmailChanges {
  teamEmail: string
}

export interface FormSupportContactChanges {
  contact?: FormMetadataContact
}

export interface FormSupportPhoneChanges {
  phone?: string
}

export interface FormSupportEmailChanges {
  address?: string
  responseTime?: string
}

export interface FormSupportOnlineChanges {
  url?: string
  text?: string
}

export interface FormPrivacyNoticeChanges {
  privacyNoticeUrl?: string
}

export interface FormNotificationEmailChanges {
  notificationEmail?: string
}

export interface FormSubmissionGuidanceChanges {
  submissionGuidance?: string
}

export interface FormUploadedChanges {
  value: string
}

export interface FormTitleUpdatedMessageData extends FormMessageDataBase {
  changes: ChangesMessageData<FormTitleChanges>
}

export interface FormOrganisationUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormOrganisationChanges>
}

export interface FormTeamNameUpdatedMessageData extends FormMessageDataBase {
  changes: ChangesMessageData<FormTeamNameChanges>
}

export interface FormTeamEmailUpdatedMessageData extends FormMessageDataBase {
  changes: ChangesMessageData<FormTeamEmailChanges>
}

export interface FormSupportContactUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormSupportContactChanges>
}

export interface FormSupportPhoneUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormSupportPhoneChanges>
}

export interface FormSupportEmailUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormSupportEmailChanges>
}

export interface FormSupportOnlineUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormSupportOnlineChanges>
}

export interface FormPrivacyNoticeUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormPrivacyNoticeChanges>
}

export interface FormNotificationEmailUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormNotificationEmailChanges>
}

export interface FormSubmissionGuidanceUpdatedMessageData
  extends FormMessageDataBase {
  changes: ChangesMessageData<FormSubmissionGuidanceChanges>
}

export interface FormUploadedMessageData extends FormMessageDataBase {
  changes: ChangesMessageData<FormUploadedChanges>
}

export interface FormDefinitionMessageData extends FormsManagerMessageDataBase {
  objectType: AuditEventMessageObjectType.FORM_DEFINITION
}

export interface FormMetadataMessageData extends FormsManagerMessageDataBase {
  objectType: AuditEventMessageObjectType.FORM_METADATA
  updatedAt: Date
  updatedBy: AuditUser
  before: FormMetadata
  after: FormMetadata
}

export interface FormDefinitionS3Meta {
  fileId: string
  filename: string
  s3Key: string
}

export interface FormDefinitionUpdatedMessageData
  extends FormDefinitionMessageData {
  requestType: FormDefinitionRequestType
}

export interface FormFullDefinitionUpdatedMessageData
  extends FormDefinitionUpdatedMessageData {
  s3Meta: FormDefinitionS3Meta
}

export type FormMessageChangesData =
  | FormTitleUpdatedMessageData
  | FormOrganisationUpdatedMessageData
  | FormTeamNameUpdatedMessageData
  | FormTeamEmailUpdatedMessageData
  | FormSupportContactUpdatedMessageData
  | FormSupportPhoneUpdatedMessageData
  | FormSupportEmailUpdatedMessageData
  | FormSupportOnlineUpdatedMessageData
  | FormPrivacyNoticeUpdatedMessageData
  | FormNotificationEmailUpdatedMessageData
  | FormSubmissionGuidanceUpdatedMessageData
  | FormUploadedMessageData

export type FormMessageActivitiesData =
  | FormCreatedMessageData
  | FormMessageDataBase

export type FormMessageUpdateDefinitionData =
  | FormDefinitionUpdatedMessageData
  | FormFullDefinitionUpdatedMessageData

export interface AuditUser {
  id: string
  displayName: string
}

export type MessageData =
  | FormMessageChangesData
  | FormMessageActivitiesData
  | FormMessageUpdateDefinitionData
  | FormMetadataMessageData

export interface MessageBase {
  schemaVersion: AuditEventMessageSchemaVersion
  category: AuditEventMessageCategory
  source: AuditEventMessageSource
  type: AuditEventMessageType
  entityId: string
  traceId: string
  endpoint: string
  createdAt: Date
  createdBy: AuditUser
  data?: MessageData
  messageCreatedAt: Date
}

export interface FormCreatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_CREATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormCreatedMessageData
}

export interface FormTitleUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TITLE_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormTitleUpdatedMessageData
}

export interface FormOrganisationUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_ORGANISATION_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormOrganisationUpdatedMessageData
}

export interface FormTeamNameUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormTeamNameUpdatedMessageData
}

export interface FormTeamEmailUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormTeamEmailUpdatedMessageData
}

export interface FormSupportPhoneUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormSupportPhoneUpdatedMessageData
}

export interface FormSupportEmailUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormSupportEmailUpdatedMessageData
}

export interface FormSupportOnlineUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormSupportOnlineUpdatedMessageData
}

export interface FormPrivacyNoticeUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormPrivacyNoticeUpdatedMessageData
}

export interface FormNotificationEmailUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormNotificationEmailUpdatedMessageData
}

export interface FormSubmissionGuidanceUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormSubmissionGuidanceUpdatedMessageData
}

export interface FormUploadedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_JSON_UPLOADED
  source: AuditEventMessageSource.FORMS_DESIGNER
  data: FormUploadedMessageData
}

export interface FormDownloadedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_JSON_DOWNLOADED
  source: AuditEventMessageSource.FORMS_DESIGNER
}

export interface FormPublishedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_PUBLISHED
}

export interface FormDraftCreatedFromLiveMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE
  source: AuditEventMessageSource.FORMS_DESIGNER
}

export interface FormLiveCreatedFromDraftMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
  source: AuditEventMessageSource.FORMS_DESIGNER
}

export interface FormDraftDeletedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DRAFT_DELETED
}

export interface FormMigratedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_MIGRATED
}

export interface FormDefinitionCreatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DEFINITION_CREATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormDefinitionMessageData
}

export interface FormDefinitionUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DEFINITION_UPDATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormMessageUpdateDefinitionData
}

export interface FormMetadataUpdatedMessage extends MessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_UPDATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormMetadataMessageData
}

export type AuditMessage =
  | FormCreatedMessage
  | FormTitleUpdatedMessage
  | FormOrganisationUpdatedMessage
  | FormTeamNameUpdatedMessage
  | FormTeamEmailUpdatedMessage
  | FormSupportPhoneUpdatedMessage
  | FormSupportEmailUpdatedMessage
  | FormSupportOnlineUpdatedMessage
  | FormPrivacyNoticeUpdatedMessage
  | FormNotificationEmailUpdatedMessage
  | FormSubmissionGuidanceUpdatedMessage
  | FormUploadedMessage
  | FormDownloadedMessage
  | FormPublishedMessage
  | FormDraftCreatedFromLiveMessage
  | FormLiveCreatedFromDraftMessage
  | FormDraftDeletedMessage
  | FormMigratedMessage
  | FormDefinitionCreatedMessage
  | FormDefinitionUpdatedMessage
  | FormMetadataUpdatedMessage

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
