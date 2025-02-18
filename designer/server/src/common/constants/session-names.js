export const sessionNames = {
  create: /** @type {const} */ ('create'),
  redirectTo: /** @type {const} */ ('redirectTo'),
  fileDownloadPassword: /** @type {const} */ ('fileDownloadPassword'),
  editorAddPage: /** @type {const} */ ('editorAddPage'),
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
    editorAddPage: /** @type {const} */ ('addPageValidationFailure'),
    editorQuestions: /** @type {const} */ ('questionsValidationFailure'),
    editorAddQuestion: /** @type {const} */ ('addQuestionValidationFailure'),
    editorQuestionDetails: /** @type {const} */ (
      'QuestionDetailsValidationFailure'
    )
  },
  successNotification: /** @type {const} */ ('successNotification'),
  errorList: /** @type {const} */ ('errorList')
}
