export const sessionNames = {
  create: /** @type {const} */ ('create'),
  redirectTo: /** @type {const} */ ('redirectTo'),
  validationFailure: {
    createForm: /** @type {const} */ ('createFormValidationFailure'),
    updateForm: /** @type {const} */ ('updateFormValidationFailure'),
    privacyNotice: /** @type {const} */ ('privacyNoticeValidationFailure'),
    contactEmail: /** @type {const} */ ('contactEmailValidationFailure'),
    contactPhone: /** @type {const} */ ('contactPhoneValidationFailure'),
    contactOnline: /** @type {const} */ ('contactOnlineValidationFailure'),
    fileDownload: /** @type {const} */ ('fileDownloadValidationFailure'),
    submissionGuidance: /** @type {const} */ (
      'submissionGuidanceValidationFailure'
    )
  },
  successNotification: /** @type {const} */ ('successNotification'),
  errorList: /** @type {const} */ ('errorList')
}
