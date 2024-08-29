/**
 * @param { ValidationFailureFile<import('~/src/types.js').FileDownload> } [validation]
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
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    buttonText: 'Download file'
  }
}

/**
 * @import { ValidationFailureFile } from '~/src/common/helpers/types.js'
 */
