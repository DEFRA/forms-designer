import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formsLibraryBackLink } from '~/src/models/links.js'

/**
 * @param { string } email
 * @param { ValidationFailure<{ email: string }> } [validation]
 */
export function fileViewModel(email, validation) {
  const pageTitle = 'You have a file to download'
  return {
    backLink: formsLibraryBackLink,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    field: {
      id: 'email',
      name: 'email',
      label: {
        text: 'Email address',
        classes: 'govuk-label--m',
        isPageHeading: false
      },
      type: 'email',
      value: validation?.formValues.email ?? email,
      autocomplete: 'email',
      spellcheck: false
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
