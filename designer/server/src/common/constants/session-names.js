export const sessionNames = {
  create: /** @type {const} */ ('create'),
  redirectTo: /** @type {const} */ ('redirectTo'),
  fileDownloadPassword: /** @type {const} */ ('fileDownloadPassword'),
  questionType: /** @type {const} */ ('questionType'),
  reorderPages: /** @type {const} */ ('reorderPages'),
  reorderQuestions: /** @type {const} */ ('reorderQuestions'),
  questionSessionState: /** @type {const} */ ('questionSessionState'),
  conditionSessionState: /** @type {const} */ ('conditionSessionState'),
  validationFailure: {
    createForm: /** @type {const} */ ('createFormValidationFailure'),
    updateForm: /** @type {const} */ ('updateFormValidationFailure'),
    privacyNotice: /** @type {const} */ ('privacyNoticeValidationFailure'),
    notificationEmail: /** @type {const} */ (
      'notificationEmailValidationFailure'
    ),
    contactEmail: /** @type {const} */ ('contactEmailValidationFailure'),
    contactPhone: /** @type {const} */ ('contactPhoneValidationFailure'),
    contactOnline: /** @type {const} */ ('contactOnlineValidationFailure'),
    fileDownload: /** @type {const} */ ('fileDownloadValidationFailure'),
    submissionGuidance: /** @type {const} */ (
      'submissionGuidanceValidationFailure'
    ),
    editorCheckAnswersSettings: /** @type {const} */ (
      'checkAnswersSettingsValidationFailure'
    ),
    editorGuidance: /** @type {const} */ ('guidanceValidationFailure'),
    editorPage: /** @type {const} */ ('pageValidationFailure'),
    editorQuestions: /** @type {const} */ ('questionsValidationFailure'),
    editorQuestion: /** @type {const} */ ('questionValidationFailure'),
    editorQuestionDetails: /** @type {const} */ (
      'questionDetailsValidationFailure'
    ),
    editorPageConditions: /** @type {const} */ (
      'pageConditionsValidationFailure'
    ),
    editorCondition: /** @type {const} */ ('conditionValidationFailure'),
    upload: /** @type {const} */ ('uploadValidationFailure')
  },
  successNotification: /** @type {const} */ ('successNotification'),
  errorList: /** @type {const} */ ('errorList'),
  logoutHint: /** @type {const} */ ('logoutHint')
}
