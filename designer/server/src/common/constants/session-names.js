export const sessionNames = {
  create: /** @type {const} */ ('create'),
  redirectTo: /** @type {const} */ ('redirectTo'),
  fileDownloadPassword: /** @type {const} */ ('fileDownloadPassword'),
  questionType: /** @type {const} */ ('questionType'),
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
    editorPage: /** @type {const} */ ('pageValidationFailure'),
    editorQuestions: /** @type {const} */ ('questionsValidationFailure'),
    editorQuestion: /** @type {const} */ ('questionValidationFailure'),
    editorQuestionDetails: /** @type {const} */ (
      'questionDetailsValidationFailure'
    )
  },
  successNotification: /** @type {const} */ ('successNotification'),
  errorList: /** @type {const} */ ('errorList'),
  forceSignOut: /** @type {const} */ ('forceSignOut')
}
