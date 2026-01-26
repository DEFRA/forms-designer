import {
  type AuditEventMessageCategory,
  type AuditEventMessageSchemaVersion,
  type AuditEventMessageSource,
  type AuditEventMessageType,
  type FormDefinitionRequestType
} from '~/src/form/form-audit/enums.js'
import { type FormMetadataContact } from '~/src/form/form-metadata/types.js'

export interface FormMessageDataBase {
  formId: string
  slug: string
  payload?: unknown
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

export interface FormFileDownloadedMessageData {
  fileId: string
  filename: string
  fileLink: string
}

export interface ExcelGenerationMessageData {
  formId: string
  formName: string
  notificationEmail: string
}

export interface FormDefinitionS3Meta {
  fileId: string
  filename: string
  s3Key: string
}

export interface FormUpdatedMessageData extends FormMessageDataBase {
  requestType: FormDefinitionRequestType
  s3Meta?: FormDefinitionS3Meta
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
  | FormFileDownloadedMessageData

export interface EntitlementMessageData {
  userId: string
  displayName: string
  email: string
  roles: string[]
}

export interface AuthenticationMessageData {
  userId: string
  displayName: string
}

export interface AuditUser {
  id: string
  displayName: string
}

export interface FormsBackupRequestedMessageData {
  totalForms: number
  durationMs: number
}

export type MessageData =
  | FormMessageChangesData
  | FormMessageActivitiesData
  | FormUpdatedMessageData
  | EntitlementMessageData
  | AuthenticationMessageData
  | ExcelGenerationMessageData
  | FormFileDownloadedMessageData
  | FormsBackupRequestedMessageData

export interface MessageBase {
  schemaVersion: AuditEventMessageSchemaVersion
  category: AuditEventMessageCategory
  source: AuditEventMessageSource
  type: AuditEventMessageType
  entityId: string
  traceId?: string
  createdAt: Date
  createdBy: AuditUser
  data?: MessageData
  messageCreatedAt: Date
}

export interface ManagerMessageBase extends MessageBase {
  source: AuditEventMessageSource.FORMS_MANAGER
}
export interface DesignerMessageBase extends MessageBase {
  source: AuditEventMessageSource.FORMS_DESIGNER
}

export interface EntitlementMessageBase extends MessageBase {
  source: AuditEventMessageSource.ENTITLEMENT
}

export interface AuthenticationMessageBase extends MessageBase {
  source: AuditEventMessageSource.AUTHENTICATION
}

export interface FormCreatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_CREATED
  data: FormCreatedMessageData
}

export interface FormTitleUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TITLE_UPDATED
  data: FormTitleUpdatedMessageData
}

export interface FormOrganisationUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_ORGANISATION_UPDATED
  data: FormOrganisationUpdatedMessageData
}

export interface FormTeamNameUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED
  data: FormTeamNameUpdatedMessageData
}

export interface FormTeamEmailUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED
  data: FormTeamEmailUpdatedMessageData
}

export interface FormSupportContactUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED
  data: FormSupportContactUpdatedMessageData
}

export interface FormSupportPhoneUpdatedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED
  data: FormSupportPhoneUpdatedMessageData
}

export interface FormSupportEmailUpdatedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED
  data: FormSupportEmailUpdatedMessageData
}

export interface FormSupportOnlineUpdatedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED
  data: FormSupportOnlineUpdatedMessageData
}

export interface FormPrivacyNoticeUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormPrivacyNoticeUpdatedMessageData
}

export interface FormNotificationEmailUpdatedMessage
  extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormNotificationEmailUpdatedMessageData
}

export interface FormSubmissionGuidanceUpdatedMessage
  extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED
  source: AuditEventMessageSource.FORMS_MANAGER
  data: FormSubmissionGuidanceUpdatedMessageData
}

export interface FormUploadedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_JSON_UPLOADED
  data: FormUploadedMessageData
}

export interface FormDownloadedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_JSON_DOWNLOADED
  data: FormMessageDataBase
}

export interface FormFileDownloadSuccessMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_FILE_DOWNLOAD_SUCCESS
  data: FormFileDownloadedMessageData
}

export interface FormFileDownloadFailureMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_FILE_DOWNLOAD_FAILURE
  data: FormFileDownloadedMessageData
}

export interface FormDraftCreatedFromLiveMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE
}

export interface FormLiveCreatedFromDraftMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
}

export interface FormDraftDeletedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_DRAFT_DELETED
}

export interface FormMigratedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_MIGRATED
}

export interface FormUpdatedMessage extends ManagerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_UPDATED
  data: FormUpdatedMessageData
}

export interface EntitlementCreatedMessage extends EntitlementMessageBase {
  category: AuditEventMessageCategory.ENTITLEMENT
  type: AuditEventMessageType.ENTITLEMENT_CREATED
  data: EntitlementMessageData
}

export interface EntitlementUpdatedMessage extends EntitlementMessageBase {
  category: AuditEventMessageCategory.ENTITLEMENT
  type: AuditEventMessageType.ENTITLEMENT_UPDATED
  data: EntitlementMessageData
}

export interface EntitlementDeletedMessage extends EntitlementMessageBase {
  category: AuditEventMessageCategory.ENTITLEMENT
  type: AuditEventMessageType.ENTITLEMENT_DELETED
  data: EntitlementMessageData
}

export interface AuthenticationLoginMessage extends AuthenticationMessageBase {
  category: AuditEventMessageCategory.AUTHENTICATION
  type: AuditEventMessageType.AUTHENTICATION_LOGIN
  data: AuthenticationMessageData
}

export interface AuthenticationLogoutManualMessage
  extends AuthenticationMessageBase {
  category: AuditEventMessageCategory.AUTHENTICATION
  type: AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL
  data: AuthenticationMessageData
}

export interface AuthenticationLogoutAutoMessage
  extends AuthenticationMessageBase {
  category: AuditEventMessageCategory.AUTHENTICATION
  type: AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO
  data: AuthenticationMessageData
}

export interface AuthenticationLogoutDifferentDeviceMessage
  extends AuthenticationMessageBase {
  category: AuditEventMessageCategory.AUTHENTICATION
  type: AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE
  data: AuthenticationMessageData
}

export interface FormSubmissionExcelRequestedMessage
  extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED
  data: ExcelGenerationMessageData
}

export interface FormCsatExcelRequestedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
  data: ExcelGenerationMessageData
}

export interface PlatformCsatExcelRequestedMessage extends DesignerMessageBase {
  category: AuditEventMessageCategory.FORM
  type: AuditEventMessageType.PLATFORM_CSAT_EXCEL_REQUESTED
  data: ExcelGenerationMessageData
}

export interface FormsBackupRequestedMessage extends DesignerMessageBase {
  type: AuditEventMessageType.FORMS_BACKUP_REQUESTED
  data: FormsBackupRequestedMessageData
}

export type AuditMessage =
  | FormCreatedMessage
  | FormTitleUpdatedMessage
  | FormOrganisationUpdatedMessage
  | FormTeamNameUpdatedMessage
  | FormTeamEmailUpdatedMessage
  | FormSupportContactUpdatedMessage
  | FormSupportPhoneUpdatedMessage
  | FormSupportEmailUpdatedMessage
  | FormSupportOnlineUpdatedMessage
  | FormPrivacyNoticeUpdatedMessage
  | FormNotificationEmailUpdatedMessage
  | FormSubmissionGuidanceUpdatedMessage
  | FormUploadedMessage
  | FormDownloadedMessage
  | FormFileDownloadSuccessMessage
  | FormFileDownloadFailureMessage
  | FormDraftCreatedFromLiveMessage
  | FormLiveCreatedFromDraftMessage
  | FormDraftDeletedMessage
  | FormMigratedMessage
  | FormUpdatedMessage
  | EntitlementCreatedMessage
  | EntitlementUpdatedMessage
  | EntitlementDeletedMessage
  | AuthenticationLoginMessage
  | AuthenticationLogoutManualMessage
  | AuthenticationLogoutAutoMessage
  | AuthenticationLogoutDifferentDeviceMessage
  | FormSubmissionExcelRequestedMessage
  | FormCsatExcelRequestedMessage
  | PlatformCsatExcelRequestedMessage
  | FormsBackupRequestedMessage

export interface AuditEvent {
  message: AuditMessage
}

export interface AuditMetaBase {
  messageId: string
  recordCreatedAt: Date
}

export interface AuditInputMeta extends AuditMetaBase {
  id: string
}

export type AuditRecordInput = AuditMessage & AuditMetaBase

export type AuditRecord = AuditMessage & AuditInputMeta

export interface MessageBody {
  Message: string
}
