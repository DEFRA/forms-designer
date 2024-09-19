import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataInput, 'notificationEmail'>>} [validation]
 */
export function notificationEmailViewModel(metadata, validation) {
  const pageTitle = 'Email address for submitted forms'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: {
      text: 'Back',
      href: `/library/${metadata.slug}`
    },
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'notificationEmail',
      name: 'notificationEmail',
      label: {
        text: 'What email address should submitted forms be sent to?'
      },
      value: formValues?.notificationEmail ?? metadata.notificationEmail
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
