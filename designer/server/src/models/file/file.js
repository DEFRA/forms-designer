import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param { ValidationFailure<{ email: string }> } [validation]
 */
export function fileViewModel(validation) {
  const pageTitle = 'You have a file to download'
  return {
    backLink: {
      text: 'Back to forms library',
      href: '/library'
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    field: {
      id: 'email',
      name: 'email',
      label: {
        text: 'Email address'
      },
      value: validation?.formValues.email
    },
    errorList: buildErrorList(validation?.formErrors, ['email']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    buttonText: 'Download file'
  }
}

/**
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
